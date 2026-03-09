import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export const UserEdit: React.FC = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();

    return (
        <Edit saveButtonProps={saveButtonProps} isLoading={queryResult?.isLoading}>
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
                    rules={[{ required: true, type: "email" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true }]}
                >
                    <Select
                        options={[
                            { label: "Admin", value: "admin" },
                            { label: "IS Operator", value: "IS operator" },
                            { label: "QC", value: "QC" },
                            { label: "QA", value: "QA" },
                            { label: "Mold Tech", value: "mold tech" },
                            { label: "Mold HoS", value: "mold HoS" },
                            { label: "Production HoS", value: "Production HoS" },
                            { label: "QA Manager", value: "QA manager" },
                        ]}
                    />
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
