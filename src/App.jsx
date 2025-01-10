import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import { AppBar, Button, Menu, MenuItem, Toolbar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import FavoritePage from './FavoritePage';
import MovieDetailPage from './MovieDetailPage';
import RatedPage from './RatedPage';
import { RatingsProvider } from './RatingsContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontSize: '1.4rem', 
  marginRight: theme.spacing(3),
}));

const UsernameButton = styled(Button)(({ theme }) => ({
  color: '#FFFF',
  fontSize: '1.3rem',
}));

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/home');
    window.location.reload();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <RatingsProvider>
      <div className="App">
        <AppBar position="static">
          <StyledToolbar>
            <img
              src="/logo.svg"
              alt="Logo"
              style={{
                width: '120px',
                height: '70px',
                cursor: 'pointer',
                marginRight: '24px', // Add spacing
              }}
              onClick={() => navigate('/home')}
            />
            <StyledButton component={Link} to="/home">
              Home
            </StyledButton>
            <StyledButton component={Link} to="/favorite">
              Favorite
            </StyledButton>
            <StyledButton component={Link} to="/rated">
              Rated
            </StyledButton>

            <Box sx={{ marginLeft: 'auto' }}> {/* Moves login/logout to the right */}
              {user ? (
                <>
                  <UsernameButton variant="outlined" onClick={handleMenuClick}>
                    {user.name || user.username || 'User'}
                  </UsernameButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <StyledButton component={Link} to="/login">
                  Login
                </StyledButton>
              )}
            </Box>
          </StyledToolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage user={user} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/favorite" element={<FavoritePage user={user} />} />
          <Route path="/movie/:movieId" element={<MovieDetailPage />} />
          <Route path="/rated" element={<RatedPage user={user} />} />
        </Routes>
      </div>
    </RatingsProvider>
  );
}

export default App;
