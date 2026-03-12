import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Select, theme, Badge, App } from "antd";
import { useList, useSubscription, useGetIdentity, HttpError } from "@refinedev/core";
import { MessageOutlined, ExpandOutlined, ShrinkOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import { ChatWindow } from "./ChatWindow";
import { chatEvents, getStoredUnreadCounts, storeUnreadCounts } from "../../utility";

interface Identity {
    id: string;
    name: string;
    role?: string;
}

interface UserProfile {
    userId: string;
    name: string;
    email?: string;
    avatar?: string;
    position?: string;
    role?: string;
}

interface Message {
    id: string;
    $id?: string;
    content: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    channel: string;
    timestamp: string;
    recipientId?: string;
    isPrivate?: boolean;
}

export const FloatingChat: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [activeChannel, setActiveChannel] = useState("general");
    const [recipient, setRecipient] = useState<{ id: string, name: string } | null>(null);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(getStoredUnreadCounts());
    const { token } = theme.useToken();
    const { notification } = App.useApp();
    const { data: identity } = useGetIdentity<Identity>();
    
    // Track active channel in page vs floating
    const pageActiveChannelRef = useRef<string | null>(null);

    // Use ref to avoid stale closures in useSubscription
    const identityRef = useRef(identity);
    useEffect(() => {
        identityRef.current = identity;
    }, [identity]);

    // Handle incoming events from ChatPage
    useEffect(() => {
        const unsubscribe = chatEvents.subscribe((event) => {
            if (event.type === 'ACTIVE_CHANNEL_CHANGED' && event.payload.source === 'page') {
                pageActiveChannelRef.current = event.payload.channel;
            } else if (event.type === 'UNREAD_COUNTS_UPDATED') {
                setUnreadCounts(event.payload);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    // Emit our active channel when it changes
    useEffect(() => {
        if (visible) {
            chatEvents.emit({ 
                type: 'ACTIVE_CHANNEL_CHANGED', 
                payload: { channel: activeChannel, source: 'floating' } 
            });
        } else {
            chatEvents.emit({ 
                type: 'ACTIVE_CHANNEL_CHANGED', 
                payload: { channel: '', source: 'floating' } 
            });
        }
    }, [activeChannel, visible]);

    const channels = React.useMemo(() => {
        const baseChannels = [
            { value: "general", label: "General", icon: <TeamOutlined /> },
            { value: "IS", label: "IS Machine", icon: <TeamOutlined /> },
            { value: "QC", label: "Quality Control", icon: <TeamOutlined /> },
            { value: "QA", label: "Quality Assurance", icon: <TeamOutlined /> },
            { value: "mold", label: "Mold Shop", icon: <TeamOutlined /> },
        ];

        if (identity?.role === "admin") {
            baseChannels.push({ value: "global", label: "Global Logs", icon: <ExpandOutlined /> });
        }
        return baseChannels;
    }, [identity]);

    const { query } = useList<UserProfile, HttpError>({
        resource: "users",
        pagination: { mode: "off" }
    });

    const { data: staffData } = query;

    const staffOptions = staffData?.data.map((user: UserProfile) => ({
        value: `user_${user.userId}`,
        label: user.name,
        icon: <UserOutlined />,
    })) || [];

    const handleSelectChange = (value: string) => {
        if (value.startsWith("user_")) {
            const userId = value.replace("user_", "");
            const user = staffData?.data.find((u: UserProfile) => u.userId === userId);
            if (user) {
                setRecipient({ id: user.userId, name: user.name });
                setActiveChannel(value);
            }
        } else {
            setRecipient(null);
            setActiveChannel(value);
        }
        
        // Clear unread count for the selected channel
        const newCounts = { ...unreadCounts, [value]: 0 };
        setUnreadCounts(newCounts);
        storeUnreadCounts(newCounts);
    };

    // Global subscription for notifications and badges
    useSubscription({
        channel: "resources/messages",
        meta: {
            types: ["created"]
        },
        onLiveEvent: (event) => {
            const newMessage = event.payload as unknown as Message;
            const currentIdentity = identityRef.current;
            
            // Only count/notify if it's not from the current user
            if (newMessage.senderId !== currentIdentity?.id) {
                const messageChannel = newMessage.isPrivate ? `user_${newMessage.senderId}` : newMessage.channel;
                
                // 1. Notification Logic (Only for DMs directed to me)
                if (newMessage.isPrivate && newMessage.recipientId === currentIdentity?.id) {
                    // Show notification if NOT currently in that specific DM channel (neither in floating nor page)
                    const isLookingAtThisDM = (visible && activeChannel === messageChannel) || (pageActiveChannelRef.current === messageChannel);
                    
                    if (!isLookingAtThisDM) {
                        const key = `open${Date.now()}`;
                        notification.info({
                            message: `New message from ${newMessage.senderName}`,
                            description: newMessage.content,
                            placement: "bottomLeft",
                            duration: 5,
                            key,
                            btn: (
                                <Button 
                                    type="primary" 
                                    size="small" 
                                    onClick={() => {
                                        setRecipient({ id: newMessage.senderId, name: newMessage.senderName });
                                        setActiveChannel(`user_${newMessage.senderId}`);
                                        setVisible(true);
                                        const nextCounts = { ...unreadCounts, [`user_${newMessage.senderId}`]: 0 };
                                        setUnreadCounts(nextCounts);
                                        storeUnreadCounts(nextCounts);
                                        notification.destroy(key);
                                    }}
                                >
                                    View Chat
                                </Button>
                            ),
                        });
                    }
                }

                // 2. Unread Badge Logic
                // Increment unread count if the channel is NOT currently active in floating AND NOT active in main page
                const isChannelActiveAnywhere = (visible && activeChannel === messageChannel) || (pageActiveChannelRef.current === messageChannel);
                
                if (!isChannelActiveAnywhere) {
                    setUnreadCounts(prev => {
                        const next = {
                            ...prev,
                            [messageChannel]: (prev[messageChannel] || 0) + 1
                        };
                        storeUnreadCounts(next);
                        return next;
                    });
                }
            }
        }
    });

    // Reset unread count for current channel when opening/changing channel
    useEffect(() => {
        if (visible && activeChannel) {
            setUnreadCounts(prev => {
                if (prev[activeChannel] === 0) return prev;
                const next = { ...prev, [activeChannel]: 0 };
                storeUnreadCounts(next);
                return next;
            });
        }
    }, [visible, activeChannel]);

    // Total unread count for the floating button
    const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            right: 24,
            zIndex: 1000,
            width: visible ? 450 : 220,
            transition: "all 0.3s ease",
        }}>
            {!visible ? (
                <Badge count={totalUnread} offset={[-10, 0]}>
                    <Button
                        type="primary"
                        icon={<MessageOutlined />}
                        onClick={() => setVisible(true)}
                        style={{
                            width: "100%",
                            height: 40,
                            borderRadius: "8px 8px 0 0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0 16px",
                            boxShadow: "0 -2px 10px rgba(0,0,0,0.2)"
                        }}
                    >
                        Industrial Chat
                        <ExpandOutlined />
                    </Button>
                </Badge>
            ) : (
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Select
                                size="small"
                                value={activeChannel}
                                onChange={handleSelectChange}
                                style={{ width: 180 }}
                                dropdownStyle={{ zIndex: 1001 }}
                            >
                                <Select.OptGroup label="Channels">
                                    {channels.map((c) => (
                                        <Select.Option key={c.value} value={c.value}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                <span>{c.label}</span>
                                                {unreadCounts[c.value] > 0 && <Badge count={unreadCounts[c.value]} size="small" />}
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select.OptGroup>
                                <Select.OptGroup label="Staff">
                                    {staffOptions.map((s) => (
                                        <Select.Option key={s.value} value={s.value}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                <span>{s.label}</span>
                                                {unreadCounts[s.value] > 0 && <Badge count={unreadCounts[s.value]} size="small" />}
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select.OptGroup>
                            </Select>
                            <Button 
                                type="text" 
                                size="small" 
                                icon={<ShrinkOutlined />} 
                                onClick={() => setVisible(false)} 
                            />
                        </div>
                    }
                    styles={{ body: { padding: "12px", height: 450, display: 'flex', flexDirection: 'column' } }}
                    style={{
                        borderRadius: "8px 8px 0 0",
                        boxShadow: "0 -5px 20px rgba(0,0,0,0.3)",
                        border: `1px solid ${token.colorBorderSecondary}`
                    }}
                >
                    <ChatWindow 
                        channel={activeChannel} 
                        recipient={recipient}
                        height={400} 
                        users={staffData?.data}
                        onUserClick={(user) => {
                            setRecipient({ id: user.id, name: user.name });
                            setActiveChannel(`user_${user.id}`);
                        }}
                    />
                </Card>
            )}
        </div>
    );
};
