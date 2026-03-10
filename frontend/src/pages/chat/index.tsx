import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import { useList } from "@refinedev/core";
import {
    MessageOutlined,
    TeamOutlined,
    SafetyCertificateOutlined,
    SettingOutlined,
    ToolOutlined,
    UserOutlined
} from "@ant-design/icons";
import { ChatWindow } from "../../components/chat/ChatWindow";
import type { MenuProps } from 'antd';

const { Sider, Content } = Layout;

export const ChatPage: React.FC = () => {
    const [activeKey, setActiveKey] = useState("general");
    const [recipient, setRecipient] = useState<{ id: string, name: string } | null>(null);
    const { token: { colorBgContainer } } = theme.useToken();

    const { query } = useList<any>({
        resource: "users",
        pagination: { mode: "off" }
    });

    const { data: staffData } = query;

    const channels = [
        { key: "general", label: "General", icon: <MessageOutlined /> },
        { key: "IS", label: "IS Machine", icon: <TeamOutlined /> },
        { key: "QC", label: "Quality Control", icon: <SafetyCertificateOutlined /> },
        { key: "QA", label: "Quality Assurance", icon: <SettingOutlined /> },
        { key: "mold", label: "Mold Shop", icon: <ToolOutlined /> },
    ];

    const handleMenuClick: MenuProps['onClick'] = (info) => {
        const key = info.key;
        if (key.startsWith("user_")) {
            const userId = key.replace("user_", "");
            const user = staffData?.data.find((u: any) => u.userId === userId);
            if (user) {
                setRecipient({ id: user.userId, name: user.name });
                setActiveKey(key);
            }
        } else {
            setRecipient(null);
            setActiveKey(key);
        }
    };

    const staffItems = staffData?.data.map((user: any) => ({
        key: `user_${user.userId}`,
        label: user.name,
        icon: <UserOutlined />,
    })) || [];

    const menuItems: MenuProps['items'] = [
        {
            key: 'channels',
            type: 'group',
            label: 'Public Channels',
            children: channels,
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
