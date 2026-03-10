import React from "react";
import { List, Avatar, Typography, Space, Button, Popconfirm, theme, Popover, Card, Divider } from "antd";
import { DeleteOutlined, MessageOutlined } from "@ant-design/icons";
import { useGetIdentity, useDelete } from "@refinedev/core";
import dayjs from "dayjs";

const { Text } = Typography;

interface MessageItemProps {
    id?: string;
    content: string;
    senderName: string;
    senderRole: string;
    timestamp: string;
    senderId: string;
    showDetails?: boolean;
    onUserClick?: (user: { id: string, name: string }) => void;
    users?: any[];
}

export const MessageItem: React.FC<MessageItemProps> = ({
    id,
    content,
    senderName,
    senderRole,
    timestamp,
    senderId,
    showDetails = true,
    onUserClick,
    users = []
}) => {
    const { data: identity } = useGetIdentity<any>();
    const { mutate: deleteMessage } = useDelete();
    const { token } = theme.useToken();

    const isAdmin = identity?.role === "admin";
    const isOwner = identity?.id === senderId;

    const userDetails = users.find(u => u.userId === senderId);

    const handleDelete = () => {
        if (id) {
            deleteMessage({
                resource: "messages",
                id: id,
            });
        }
    };

    const userPopoverContent = (
        <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ width: 250 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Avatar size={64}>{senderName?.[0]?.toUpperCase()}</Avatar>
                <div>
                    <Text strong style={{ fontSize: '16px', display: 'block' }}>{senderName}</Text>
                    <Text type="secondary" style={{ display: 'block' }}>{senderRole.toUpperCase()}</Text>
                    {userDetails?.position && <Text type="secondary" style={{ display: 'block' }}>{userDetails.position}</Text>}
                </div>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Email</Text>
                <div style={{ wordBreak: 'break-all' }}>{userDetails?.email || 'N/A'}</div>
            </div>
            {identity?.id !== senderId && (
                <Button 
                    type="primary" 
                    icon={<MessageOutlined />} 
                    block
                    onClick={() => onUserClick?.({ id: senderId, name: senderName })}
                >
                    Direct Message
                </Button>
            )}
        </Card>
    );

    return (
        <List.Item
            style={{ 
                padding: showDetails ? '12px 0 4px 0' : '2px 0',
                borderBlockEnd: 'none'
            }}
            actions={[
                (isAdmin || isOwner) && id ? (
                    <Popconfirm
                        title="Delete this message?"
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            type="text" 
                            size="small" 
                            danger 
                            icon={<DeleteOutlined />} 
                        />
                    </Popconfirm>
                ) : null,
            ]}
        >
            <div style={{ width: '100%' }}>
                {showDetails && (
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', gap: '8px' }}>
                        <Popover content={userPopoverContent} trigger="hover" placement="right">
                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Avatar size="small">{senderName[0]?.toUpperCase()}</Avatar>
                                <Text strong>{senderName}</Text>
                            </div>
                        </Popover>
                    </div>
                )}
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-end',
                    paddingLeft: showDetails ? '32px' : '32px' // Keep aligned even if details are hidden
                }}>
                    <div style={{ 
                        color: token.colorText, 
                        background: isOwner ? token.colorPrimaryBg : token.colorFillAlter, 
                        padding: '6px 12px', 
                        borderRadius: '8px',
                        maxWidth: '80%',
                        wordBreak: 'break-word',
                        border: isOwner ? `1px solid ${token.colorPrimaryBorder}` : 'none'
                    }}>
                        {content}
                    </div>
                    <Text type="secondary" style={{ fontSize: "10px", marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                        {dayjs(timestamp).format("HH:mm")}
                    </Text>
                </div>
            </div>
        </List.Item>
    );
};
