import React, { useState, useRef, useEffect } from "react";
import { useList, useCreate, useGetIdentity } from "@refinedev/core";
import { List, Input, Button, Card, Space, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { MessageItem } from "./MessageItem";

interface ChatWindowProps {
    channel?: string;
    height?: string | number;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ channel = "general", height = "100%" }) => {
    const [message, setMessage] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: identity } = useGetIdentity<any>();
    const scrollRef = useRef<HTMLDivElement>(null);

    const { query } = useList({
        resource: "messages",
        filters: [
            {
                field: "channel",
                operator: "eq",
                value: channel,
            },
        ],
        sorters: [
            {
                field: "timestamp",
                order: "asc",
            },
        ],
        liveMode: "auto",
        pagination: {
            mode: "off",
        }
    });

    const { data, isLoading } = query;

    const { mutate: sendMessage, isLoading: isSending } = useCreate({
        successNotification: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;

    const handleSend = () => {
        if (!message.trim() || !identity) return;

        sendMessage({
            resource: "messages",
            values: {
                content: message,
                senderId: identity.id,
                senderName: identity.name,
                senderRole: identity.role || "user",
                channel: channel,
                timestamp: new Date().toISOString(),
            },
        });
        setMessage("");
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [data]);

    const content = (
        <div style={{ height: height, display: "flex", flexDirection: "column" }}>
            <div 
                ref={scrollRef}
                style={{ flex: 1, overflowY: "auto", marginBottom: "16px", padding: "8px" }}
            >
                {isLoading ? (
                    <div style={{ textAlign: "center", padding: "20px" }}><Spin /></div>
                ) : (
                    <List
                        dataSource={data?.data}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        renderItem={(item: any) => (
                            <MessageItem
                                content={item.content}
                                senderName={item.senderName}
                                senderRole={item.senderRole}
                                timestamp={item.timestamp}
                            />
                        )}
                    />
                )}
            </div>
            
            <Space.Compact style={{ width: '100%' }}>
                <Input 
                    placeholder="Type a message..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onPressEnter={handleSend}
                    disabled={isSending}
                />
                <Button 
                    type="primary" 
                    icon={<SendOutlined />} 
                    onClick={handleSend}
                    loading={isSending}
                >
                    Send
                </Button>
            </Space.Compact>
        </div>
    );

    if (height !== "100%") {
        return content;
    }

    return (
        <Card 
            title={`Channel: ${channel.toUpperCase()}`} 
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
            styles={{ body: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" } }}
        >
            {content}
        </Card>
    );
};
