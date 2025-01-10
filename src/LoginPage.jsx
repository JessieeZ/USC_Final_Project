import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, CircularProgress, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_KEY = "06ac932ac0d2f566714e74f87bd668ff";
const BASE_URL = "https://api.themoviedb.org/3";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const requestHeader = {
    accept: "application/json",
    "content-type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjQ5YjhlZjliNGNmMzE0OGQzOGRjZmE4NDBkOGQyMCIsIm5iZiI6MTczMzI0MDgwOS41MTIsInN1YiI6IjY3NGYyN2U5ZDI3ZGNmMDA1MjNmNGE5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WFQwhzh-pSTIAJWXUMZPgkTQvHkLMHVViJZwIMdSB8I",
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const requestTokenResponse = await axios.get(
        `${BASE_URL}/authentication/token/new`,
        { headers: requestHeader }
      );

      const requestToken = requestTokenResponse.data.request_token;

      const validateResponse = await axios.post(
        `${BASE_URL}/authentication/token/validate_with_login`,
        { username, password, request_token: requestToken },
        { headers: requestHeader }
      );

      const sessionResponse = await axios.post(
        `${BASE_URL}/authentication/session/new`,
        { request_token: validateResponse.data.request_token },
        { headers: requestHeader }
      );

      const sessionId = sessionResponse.data.session_id;

      const accountDetailsResponse = await axios.get(
        `https://api.themoviedb.org/3/account?api_key=${API_KEY}&session_id=${sessionId}`,
        { headers: requestHeader }
      );

      const userData = accountDetailsResponse.data;

      setUser(userData);
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("user", JSON.stringify(userData));

      window.location.reload();
    } catch (err) {
      console.error("Error during login:", err);
      setError("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("sessionId");
    setUser(null);
    navigate("/login");
    window.location.reload();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedUser && storedSessionId) {
      setUser(JSON.parse(storedUser));
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "16px" }}>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} style={{ width: "100%", maxWidth: "400px" }}>
        <TextField label="Username" variant="outlined" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} required sx={{ marginBottom: "16px" }} />
        <TextField label="Password" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ marginBottom: "16px" }} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" fullWidth type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24} color="secondary" /> : "Submit"}
        </Button>
      </form>

      {user && (
        <Box>
          <Button variant="outlined" onClick={handleMenuClick} sx={{ marginTop: "16px", color: "#FF6347" }}>
            {user.name || user.username}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
}

export default LoginPage;
