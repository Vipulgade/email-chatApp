import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Container, Box, TextField, Button, Typography, CircularProgress } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", username);
        alert("Login successful!");
        navigate("/chat");
      } else {
        setError(response.data.error || "Invalid credentials. Try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="login-container">
      <Box className="login-box" sx={{ maxWidth: 400, margin: "auto", mt: 8, p: 3, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
        
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
