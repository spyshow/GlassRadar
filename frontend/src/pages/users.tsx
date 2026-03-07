import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export const UsersPage = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
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
                    rules={[{ required: true }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true }]}
                >
                    <Select
                        options={[
                            { label: "Admin", value: "admin" },
                            { label: "IS Operator", value: "is_operator" },
                            { label: "QC", value: "qc" },
                            { label: "QA", value: "qa" },
                            { label: "HoS", value: "hos" },
                            { label: "Mold Tech", value: "mold_tech" },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Create>
    );
};