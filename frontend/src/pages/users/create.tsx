import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { v4 as uuidv4 } from "uuid";

export const UserCreate: React.FC = () => {
    const { formProps, saveButtonProps, onFinish } = useForm();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFinish = async (values: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_confirm, ...rest } = values;
        const userId = uuidv4();

        try {
            await onFinish({
                ...rest,
                userId: userId,
            });
        } catch (error) {
            console.error("User creation failed:", error);
        }
    };

    return (
        <Create saveButtonProps={{ ...saveButtonProps, onClick: () => formProps.form?.submit() }}>
            <Form 
                {...formProps} 
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item name="userId" hidden>
                    <Input />
                </Form.Item>

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
                        { required: true, min: 8, message: "Password must be at least 8 characters." }
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Password for login" />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="password_confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
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
        </Create>
    );
};
