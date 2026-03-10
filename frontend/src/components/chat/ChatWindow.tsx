import React, { useState, useRef, useEffect, useMemo } from "react";
import { useList, useCreate, useGetIdentity } from "@refinedev/core";
import { List, Input, Button, Card, Space, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { MessageItem } from "./MessageItem";
import { getPrivateChannelId } from "../../utility/chatUtils";

interface ChatWindowProps {
    channel?: string;
    recipient?: { id: string, name: string } | null;
    height?: string | number;
    onUserClick?: (user: { id: string, name: string }) => void;
    users?: any[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ channel = "general", recipient, height = "100%", onUserClick, users }) => {
    const [message, setMessage] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: identity } = useGetIdentity<any>();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Compute the actual channel ID. 
    // For DMs, it's a stable string derived from both user IDs.
    const actualChannel = useMemo(() => {
        if (recipient && identity) {
            return getPrivateChannelId(identity.id, recipient.id);
        }
        return channel;
    }, [channel, recipient, identity]);

    const { query } = useList({
        resource: "messages",
        filters: [
            {
                field: "channel",
                operator: "eq",
                value: actualChannel,
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
        },
        meta: {
            databaseId: "default"
        }
    });

    const { data, isLoading } = query;

    const { mutate: sendMessage, isLoading: isSending } = useCreate({
        successNotification: false,
    }) as any;

    const handleSend = () => {
        if (!message.trim() || !identity) return;

        const isPrivate = !!recipient;
        
        // Define document-level permissions if it's a private message
        const permissions = isPrivate ? [
            `read("user:${identity.id}")`,
            `read("user:${recipient.id}")`,
            `read("team:admin")`, 
            `delete("team:admin")`
        ] : undefined;

        sendMessage({
            resource: "messages",
            values: {
                content: message,
                senderId: identity.id,
                senderName: identity.name,
                senderRole: identity.role || "user",
                channel: actualChannel,
                timestamp: new Date().toISOString(),
                recipientId: recipient?.id,
                isPrivate: isPrivate,
            },
            meta: {
                permissions: permissions
            }
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
                        renderItem={(item: any, index: number) => {
                            const prevItem = data?.data[index - 1];
                            const isConsecutive = prevItem && prevItem.senderId === item.senderId;
                            
                            return (
                                <MessageItem
                                    id={item.$id || item.id}
                                    content={item.content}
                                    senderName={item.senderName}
                                    senderRole={item.senderRole}
                                    timestamp={item.timestamp}
                                    senderId={item.senderId}
                                    showDetails={!isConsecutive}
                                    onUserClick={onUserClick}
                                    users={users}
                                />
                            );
                        }}
                    />
                )}
            </div>
            
            <Space.Compact style={{ width: '100%' }}>
                <Input 
                    placeholder={recipient ? `Message ${recipient.name}...` : "Type a message..."} 
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
            title={recipient ? `Chat with ${recipient.name}` : `Channel: ${channel.toUpperCase()}`} 
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
            styles={{ body: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" } }}
        >
            {content}
        </Card>
    );
};
