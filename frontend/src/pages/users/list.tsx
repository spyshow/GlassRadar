import React from "react";
import {
    List,
    useTable,
    EditButton,
    ShowButton,
    DeleteButton,
    EmailField,
} from "@refinedev/antd";
import { Table, Space, Tag } from "antd";
import { ROLE_COLORS } from "../../providers/constants";

export const UserList: React.FC = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} rowKey={(record) => record.id || record.$id}>
                <Table.Column dataIndex="name" title="Name" />
                <Table.Column
                    dataIndex="email"
                    title="Email"
                    render={(value: string) => <EmailField value={value} />}
                />
                <Table.Column 
                    dataIndex="role" 
                    title="Role"
                    render={(value: string) => (
                        <Tag color={ROLE_COLORS[value] || "default"}>
                            {value ? value.toUpperCase() : ""}
                        </Tag>
                    )}
                />
                <Table.Column dataIndex="position" title="Position" />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    render={(_, record: any) => {
                        const id = record.id || record.$id;
                        
                        return (
                            <Space>
                                <EditButton 
                                    hideText={false} 
                                    size="small" 
                                    recordItemId={id}
                                />
                                <ShowButton 
                                    hideText={false} 
                                    size="small" 
                                    recordItemId={id}
                                />
                                <DeleteButton 
                                    hideText={false} 
                                    size="small" 
                                    recordItemId={id} 
                                />
                            </Space>
                        );
                    }}
                />
            </Table>
        </List>
    );
};
