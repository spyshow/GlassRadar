import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu, theme, Badge } from "antd";
import { useList, useGetIdentity, HttpError, useSubscription } from "@refinedev/core";
import {
    MessageOutlined,
    TeamOutlined,
    SafetyCertificateOutlined,
    SettingOutlined,
    ToolOutlined,
    UserOutlined,
    ExpandOutlined
} from "@ant-design/icons";
import { ChatWindow } from "../../components/chat/ChatWindow";
import type { MenuProps } from 'antd';
import { chatEvents, getStoredUnreadCounts, storeUnreadCounts } from "../../utility";

const { Sider, Content } = Layout;

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

export const ChatPage: React.FC = () => {
    const [activeKey, setActiveKey] = useState("general");
    const [recipient, setRecipient] = useState<{ id: string, name: string } | null>(null);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(getStoredUnreadCounts());
    const { token: { colorBgContainer } } = theme.useToken();

    const { query } = useList<UserProfile, HttpError>({
        resource: "users",
        pagination: { mode: "off" }
    });

    const { data: staffData } = query;
    const { data: identity } = useGetIdentity<Identity>();
    
    // Track active channel in floating chat
    const floatingActiveChannelRef = useRef<string | null>(null);

    // Use ref to avoid stale closures in useSubscription
    const identityRef = useRef(identity);
    useEffect(() => {
        identityRef.current = identity;
    }, [identity]);

    // Handle incoming events from FloatingChat
    useEffect(() => {
        const unsubscribe = chatEvents.subscribe((event) => {
            if (event.type === 'ACTIVE_CHANNEL_CHANGED' && event.payload.source === 'floating') {
                floatingActiveChannelRef.current = event.payload.channel;
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
        chatEvents.emit({ 
            type: 'ACTIVE_CHANNEL_CHANGED', 
            payload: { channel: activeKey, source: 'page' } 
        });
        
        // Ensure cleanup when unmounting page
        return () => {
            chatEvents.emit({ 
                type: 'ACTIVE_CHANNEL_CHANGED', 
                payload: { channel: '', source: 'page' } 
            });
        };
    }, [activeKey]);

    const channels = React.useMemo(() => {
        const baseChannels = [
            { key: "general", label: "General", icon: <MessageOutlined /> },
            { key: "IS", label: "IS Machine", icon: <TeamOutlined /> },
            { key: "QC", label: "Quality Control", icon: <SafetyCertificateOutlined /> },
            { key: "QA", label: "Quality Assurance", icon: <SettingOutlined /> },
            { key: "mold", label: "Mold Shop", icon: <ToolOutlined /> },
        ];

        if (identity?.role === "admin") {
            baseChannels.push({ key: "global", label: "Global Logs", icon: <ExpandOutlined /> });
        }
        return baseChannels;
    }, [identity]);

    const handleMenuClick: MenuProps['onClick'] = (info) => {
        const key = info.key;
        if (key.startsWith("user_")) {
            const userId = key.replace("user_", "");
            const user = staffData?.data.find((u: UserProfile) => u.userId === userId);
            if (user) {
                setRecipient({ id: user.userId, name: user.name });
                setActiveKey(key);
            }
        } else {
            setRecipient(null);
            setActiveKey(key);
        }
        
        // Clear unread count
        const newCounts = { ...unreadCounts, [key]: 0 };
        setUnreadCounts(newCounts);
        storeUnreadCounts(newCounts);
    };

    // Subscription for unread counts ONLY (Notifications handled by FloatingChat globally)
    useSubscription({
        channel: "resources/messages",
        meta: {
            types: ["created"]
        },
        onLiveEvent: (event) => {
            const newMessage = event.payload as unknown as Message;
            const currentIdentity = identityRef.current;
            
            if (newMessage.senderId !== currentIdentity?.id) {
                const messageChannel = newMessage.isPrivate ? `user_${newMessage.senderId}` : newMessage.channel;
                
                // Increment unread count if channel is not currently active anywhere
                const isChannelActiveAnywhere = (activeKey === messageChannel) || (floatingActiveChannelRef.current === messageChannel);
                
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

    // Reset unread count for current channel
    useEffect(() => {
        if (activeKey) {
            setUnreadCounts(prev => {
                if (prev[activeKey] === 0) return prev;
                const next = { ...prev, [activeKey]: 0 };
                storeUnreadCounts(next);
                return next;
            });
        }
    }, [activeKey]);

    const menuItems: MenuProps['items'] = React.useMemo(() => {
        const staffItems = staffData?.data.map((user: UserProfile) => ({
            key: `user_${user.userId}`,
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>{user.name}</span>
                    {unreadCounts[`user_${user.userId}`] > 0 && <Badge count={unreadCounts[`user_${user.userId}`]} size="small" />}
                </div>
            ),
            icon: <UserOutlined />,
        })) || [];

        const channelItems = channels.map((c) => ({
            key: c.key,
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>{c.label}</span>
                    {unreadCounts[c.key] > 0 && <Badge count={unreadCounts[c.key]} size="small" />}
                </div>
            ),
            icon: c.icon,
        }));

        return [
            {
                key: 'channels',
                type: 'group',
                label: 'Public Channels',
                children: channelItems,
            },
            {
                type: 'divider',
            },
            {
                key: 'staff',
                type: 'group',
                label: 'Direct Messages',
                children: staffItems,
            },
        ];
    }, [channels, staffData, unreadCounts]);

    return (
        <Layout style={{ height: "calc(100vh - 150px)", background: colorBgContainer }}>
            <Sider width={250} style={{ background: colorBgContainer, overflow: 'auto' }}>
                <Menu
                    mode="inline"
                    selectedKeys={[activeKey]}
                    style={{ height: '100%', borderRight: 0 }}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Content style={{ padding: '0 24px', height: '100%' }}>
                <ChatWindow 
                    channel={activeKey} 
                    recipient={recipient}
                    users={staffData?.data}
                    onUserClick={(user) => {
                        setRecipient({ id: user.id, name: user.name });
                        setActiveKey(`user_${user.id}`);
                    }}
                />
            </Content>
        </Layout>
    );
};
