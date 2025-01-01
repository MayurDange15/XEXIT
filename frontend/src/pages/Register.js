import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Typography, Box } from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, confirmPassword } = formData;

    // Validation
    if (!username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Call the registration API
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        username,
        password,
      });
      setSuccess("User registered successfully!");
      setError("");

      // Redirect to login page after success
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding={2}
    >
      <Typography variant="h4" mb={3}>
        User Registration
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
        width="100%"
        maxWidth="400px"
      >
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          fullWidth
          required
        />
        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" textAlign="center">
            {success}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
