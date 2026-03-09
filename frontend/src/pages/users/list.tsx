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

export const UserList: React.FC = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} rowKey="$id">
                <Table.Column dataIndex="name" title="Name" />
                <Table.Column
                    dataIndex="email"
                    title="Email"
                    render={(value) => <EmailField value={value} />}
                />
                <Table.Column 
                    dataIndex="role" 
                    title="Role"
                    render={(value) => (
                        <Tag color="blue">{value}</Tag>
                    )}
                />
                <Table.Column dataIndex="position" title="Position" />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: any) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record.$id} />
                            <ShowButton hideText size="small" recordItemId={record.$id} />
                            <DeleteButton hideText size="small" recordItemId={record.$id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
