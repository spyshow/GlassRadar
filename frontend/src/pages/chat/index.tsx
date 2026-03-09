import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
    MessageOutlined,
    TeamOutlined,
    SafetyCertificateOutlined,
    SettingOutlined,
    ToolOutlined
} from "@ant-design/icons";
import { ChatWindow } from "../../components/chat/ChatWindow";

const { Sider, Content } = Layout;

export const ChatPage: React.FC = () => {
    const [activeChannel, setActiveChannel] = useState("general");
    const { token: { colorBgContainer } } = theme.useToken();

    const channels = [
        { key: "general", label: "General", icon: <MessageOutlined /> },
        { key: "IS", label: "IS Machine", icon: <TeamOutlined /> },
        { key: "QC", label: "Quality Control", icon: <SafetyCertificateOutlined /> },
        { key: "QA", label: "Quality Assurance", icon: <SettingOutlined /> },
        { key: "mold", label: "Mold Shop", icon: <ToolOutlined /> },
    ];

    return (
        <Layout style={{ height: "calc(100vh - 150px)", background: colorBgContainer }}>
            <Sider width={200} style={{ background: colorBgContainer }}>
                <Menu
                    mode="inline"
                    selectedKeys={[activeChannel]}
                    style={{ height: '100%', borderRight: 0 }}
                    items={channels}
                    onClick={(e) => setActiveChannel(e.key)}
                />
            </Sider>
            <Content style={{ padding: '0 24px', height: '100%' }}>
                <ChatWindow channel={activeChannel} />
            </Content>
        </Layout>
    );
};
