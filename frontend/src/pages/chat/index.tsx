import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu, theme, Badge, App } from "antd";
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
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    const { token: { colorBgContainer } } = theme.useToken();
    const { notification } = App.useApp();

    const { query } = useList<UserProfile, HttpError>({
        resource: "users",
        pagination: { mode: "off" }
    });

    const { data: staffData } = query;
    const { data: identity } = useGetIdentity<Identity>();
    
    // Use ref to avoid stale closures in useSubscription
    const identityRef = useRef(identity);
    useEffect(() => {
        identityRef.current = identity;
    }, [identity]);

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
        setUnreadCounts(prev => ({ ...prev, [key]: 0 }));
    };

    // Subscription for unread counts and notifications
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
                
                // Trigger notification for DMs directed to current user
                if (newMessage.isPrivate && newMessage.recipientId === currentIdentity?.id) {
                    notification.info({
                        message: `New message from ${newMessage.senderName}`,
                        description: newMessage.content,
                        placement: "bottomLeft",
                        duration: 5,
                        onClick: () => {
                            setRecipient({ id: newMessage.senderId, name: newMessage.senderName });
                            setActiveKey(`user_${newMessage.senderId}`);
                            setUnreadCounts(prev => ({ ...prev, [`user_${newMessage.senderId}`]: 0 }));
                        }
                    });
                }

                // Increment unread count if channel is not currently active
                if (activeKey !== messageChannel) {
                    setUnreadCounts(prev => ({
                        ...prev,
                        [messageChannel]: (prev[messageChannel] || 0) + 1
                    }));
                }
            }
        }
    });

    // Reset unread count for current channel
    useEffect(() => {
        if (activeKey) {
            setUnreadCounts(prev => ({ ...prev, [activeKey]: 0 }));
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
