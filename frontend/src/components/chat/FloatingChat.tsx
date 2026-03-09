import React, { useState } from "react";
import { Button, Card, Select, theme } from "antd";
import { MessageOutlined, ExpandOutlined, ShrinkOutlined } from "@ant-design/icons";
import { ChatWindow } from "./ChatWindow";

export const FloatingChat: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [activeChannel, setActiveChannel] = useState("general");
    const { token } = theme.useToken();

    const channels = [
        { value: "general", label: "General" },
        { value: "IS", label: "IS Machine" },
        { value: "QC", label: "Quality Control" },
        { value: "QA", label: "Quality Assurance" },
        { value: "mold", label: "Mold Shop" },
    ];

    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            right: 24,
            zIndex: 1000,
            width: visible ? 350 : 200,
            transition: "all 0.3s ease",
        }}>
            {!visible ? (
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
            ) : (
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Select
                                size="small"
                                value={activeChannel}
                                options={channels}
                                onChange={setActiveChannel}
                                style={{ width: 150 }}
                                dropdownStyle={{ zIndex: 1001 }}
                            />
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
                    <ChatWindow channel={activeChannel} height={400} />
                </Card>
            )}
        </div>
    );
};
