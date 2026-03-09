import React from "react";
import { Show, EmailField, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Tag, Space } from "antd";
import { ROLE_COLORS } from "../../providers/constants";

const { Title } = Typography;

export const UserShow: React.FC = () => {
    const { query } = useShow();
    const { data, isLoading } = query;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <div>
                    <Title level={5}>Name</Title>
                    <TextField value={record?.name} />
                </div>
                
                <div>
                    <Title level={5}>Email</Title>
                    <EmailField value={record?.email} />
                </div>

                <div>
                    <Title level={5}>Role</Title>
                    <Tag color={ROLE_COLORS[record?.role] || "default"}>
                        {record?.role ? record.role.toUpperCase() : ""}
                    </Tag>
                </div>

                <div>
                    <Title level={5}>Position</Title>
                    <TextField value={record?.position} />
                </div>
            </Space>
        </Show>
    );
};
