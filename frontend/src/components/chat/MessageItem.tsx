import React from "react";
import { List, Avatar, Typography, Tag, Space } from "antd";
import { ROLE_COLORS } from "../../providers/constants";
import dayjs from "dayjs";

const { Text } = Typography;

interface MessageProps {
    content: string;
    senderName: string;
    senderRole: string;
    timestamp: string;
}

export const MessageItem: React.FC<MessageProps> = ({
    content,
    senderName,
    senderRole,
    timestamp,
}) => {
    return (
        <List.Item>
            <List.Item.Meta
                avatar={<Avatar>{senderName[0]?.toUpperCase()}</Avatar>}
                title={
                    <Space>
                        <Text strong>{senderName}</Text>
                        <Tag color={ROLE_COLORS[senderRole] || "default"}>
                            {senderRole.toUpperCase()}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {dayjs(timestamp).format("HH:mm:ss")}
                        </Text>
                    </Space>
                }
                description={<Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>{content}</Text>}
            />
        </List.Item>
    );
};
