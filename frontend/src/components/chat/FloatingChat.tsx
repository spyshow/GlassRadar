import React, { useState, useEffect } from "react";
import { Button, Card, Select, theme, Badge, notification } from "antd";
import { useList, useSubscription, useGetIdentity } from "@refinedev/core";
import { MessageOutlined, ExpandOutlined, ShrinkOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import { ChatWindow } from "./ChatWindow";

export const FloatingChat: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [activeChannel, setActiveChannel] = useState("general");
    const [recipient, setRecipient] = useState<{ id: string, name: string } | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const { token } = theme.useToken();
    const { data: identity } = useGetIdentity<any>();

    const { query } = useList<any>({
        resource: "users",
        pagination: { mode: "off" }
    });

    const { data: staffData } = query;

    const channels = [
        { value: "general", label: "General", icon: <TeamOutlined /> },
        { value: "IS", label: "IS Machine", icon: <TeamOutlined /> },
        { value: "QC", label: "Quality Control", icon: <TeamOutlined /> },
        { value: "QA", label: "Quality Assurance", icon: <TeamOutlined /> },
        { value: "mold", label: "Mold Shop", icon: <TeamOutlined /> },
    ];

    if (identity?.role === "admin") {
        channels.push({ value: "global", label: "Global Logs", icon: <ExpandOutlined /> });
    }

    const staffOptions = staffData?.data.map((user: any) => ({
        value: `user_${user.userId}`,
        label: user.name,
        icon: <UserOutlined />,
    })) || [];

    const handleSelectChange = (value: string) => {
        if (value.startsWith("user_")) {
            const userId = value.replace("user_", "");
            const user = staffData?.data.find((u: any) => u.userId === userId);
            if (user) {
                setRecipient({ id: user.userId, name: user.name });
                setActiveChannel(value);
            }
        } else {
            setRecipient(null);
            setActiveChannel(value);
        }
    };

    // Global subscription for notifications and badges
    // Using explicit channel property for Refine v5
    useSubscription({
        channel: "resources/messages",
        meta: {
            types: ["created"]
        },
        onLiveEvent: (event: any) => {
            const newMessage = event.payload;
            
            // Only count/notify if it's not from the current user
            if (newMessage.senderId !== identity?.id) {
                
                // Trigger notification for DMs directed to current user
                if (newMessage.isPrivate && newMessage.recipientId === identity?.id) {
                    notification.info({
                        message: `New message from ${newMessage.senderName}`,
                        description: newMessage.content,
                        placement: "bottomLeft",
                        onClick: () => {
                            setRecipient({ id: newMessage.senderId, name: newMessage.senderName });
                            setActiveChannel(`user_${newMessage.senderId}`);
                            setVisible(true);
                        }
                    });
                }

                // Increment badge count if window is hidden
                if (!visible) {
                    setUnreadCount(prev => prev + 1);
                }
            }
        }
    });

    // Reset unread count when opening the window
    useEffect(() => {
        if (visible) {
            setUnreadCount(0);
        }
    }, [visible]);

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
                <Badge count={unreadCount} offset={[-10, 0]}>
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
                                    {channels.map((c: any) => (
                                        <Select.Option key={c.value} value={c.value}>{c.label}</Select.Option>
                                    ))}
                                </Select.OptGroup>
                                <Select.OptGroup label="Staff">
                                    {staffOptions.map((s: any) => (
                                        <Select.Option key={s.value} value={s.value}>{s.label}</Select.Option>
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
