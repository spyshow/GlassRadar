import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export const UserEdit: React.FC = () => {
    const { formProps, saveButtonProps, query, onFinish } = useForm();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFinish = async (values: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_confirm, ...rest } = values;

        try {
            await onFinish({
                ...rest,
            });
        } catch (error) {
            console.error("User update failed:", error);
        }
    };

    return (
        <Edit saveButtonProps={{ ...saveButtonProps, onClick: () => formProps.form?.submit() }} isLoading={query?.isLoading}>
            <Form 
                {...formProps} 
                layout="vertical"
                onFinish={handleFinish}
            >
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
                    label="Password"
                    name="password"
                    rules={[
                        { min: 8, message: "Password must be at least 8 characters." }
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Leave empty to keep current password" />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="password_confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm password" />
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
