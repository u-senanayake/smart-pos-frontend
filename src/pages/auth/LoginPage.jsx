import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import * as ROUTES from "../../utils/const/RouteProperty";
import * as MESSAGE from "../../utils/const/Message";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const login = await AuthService.login(username, password);
            console.log(MESSAGE.LOGIN_SUCCESS.replace(":param", login.token));
            navigate(ROUTES.ROOT);
        } catch (error) {
            console.error(MESSAGE.LOGIN_ERROR.replace(":param", error));
            setErrorMessage(MESSAGE.LOGIN_FAILED_MSG);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Login
            </Typography>
            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}
            <Box component="form" noValidate autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default LoginPage;
