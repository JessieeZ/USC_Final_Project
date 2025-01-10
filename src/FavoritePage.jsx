import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, IconButton, CircularProgress, Box } from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FavoritePage = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(storedFavorites);
    }
  }, [user]);

  const handleFavorite = (movie) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography variant="h6">Please log in to view your favorite movies.</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" align="center" sx={{ marginBottom: 3, marginTop: 3 }}>
        Favorite Movies
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <Typography variant="h6" color="error">{error}</Typography>
        </Box>
      ) : favorites.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <Typography variant="h6">You have no favorite movies yet.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {favorites.map((movie) => (
            <Grid item xs={12} sm={6} md={3} key={movie.id}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  alt={movie.title}
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="h6" align="center" sx={{ marginBottom: 1 }} noWrap>
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem', color: 'gold' }}>★</span> {movie.vote_average}
                    </Typography>
                    <IconButton
                      onClick={() => handleFavorite(movie)}
                      color={favorites.some((fav) => fav.id === movie.id) ? 'error' : 'default'}
                    >
                      {favorites.some((fav) => fav.id === movie.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default FavoritePage;
