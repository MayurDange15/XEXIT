import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // Import axios instance
import { TextField, Button, Box, Typography, Alert } from "@mui/material";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await axiosInstance.post("/auth/login", credentials); // Use axiosInstance
      const { token } = res.data;

      // Save token in localStorage
      localStorage.setItem("token", token);

      // Decode role from token (or fetch it from backend if required)
      const role = JSON.parse(atob(token.split(".")[1])).role;
      if (role === "hr") {
        navigate("/hr-dashboard");
      } else if (role === "employee") {
        navigate("/employee-dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <TextField
          label="Username"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </Box>

      {/* Register Link */}
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{ textDecoration: "none", color: "#1976d2" }}
        >
          Register here
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
