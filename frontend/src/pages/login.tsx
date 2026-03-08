import { AuthPage } from "@refinedev/antd";

export const Login = () => {
    return (
        <AuthPage
            type="login"
            formProps={{
                initialValues: {
                    email: "admin@glassradar.local",
                    password: "password123",
                },
            }}
        />
    );
};