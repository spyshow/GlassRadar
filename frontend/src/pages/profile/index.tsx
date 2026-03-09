import React, { useEffect, useState } from "react";
import { useGetIdentity, useUpdate, useNotification } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Card, Spin } from "antd";
import { databases } from "../../utility";
import { Query } from "@refinedev/appwrite";

export const ProfilePage: React.FC = () => {
    const { data: identity, isLoading: identityLoading } = useGetIdentity<any>();
    const [docId, setDocId] = useState<string | null>(null);
    const { open } = useNotification();

    const { formProps, saveButtonProps, queryResult, onFinish } = useForm({
        resource: "users",
        id: docId ?? undefined,
        action: "edit",
        queryOptions: {
            enabled: !!docId,
        }
    });

    useEffect(() => {
        if (identity?.id) {
            databases.listDocuments("default", "users", [
                Query.equal("userId", identity.id)
            ]).then(({ documents }) => {
                if (documents.length > 0) {
                    setDocId(documents[0].$id);
                }
            });
        }
    }, [identity]);

    if (identityLoading || (identity?.id && !docId)) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Edit 
            saveButtonProps={saveButtonProps} 
            title="My Profile"
            canDelete={false}
        >
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name="role"
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Position"
                    name="position"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Avatar URL"
                    name="avatar"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Edit>
    );
};
