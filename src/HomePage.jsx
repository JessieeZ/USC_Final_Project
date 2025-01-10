import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Chip,
} from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ user }) => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('popular');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const categories = ['popular', 'now_playing', 'top_rated', 'upcoming'];

  useEffect(() => {
    fetchMovies();
    if (user) {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(storedFavorites);
    }
  }, [user, category, page]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${category}?api_key=06ac932ac0d2f566714e74f87bd668ff&page=${page}`
      );
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = (movie) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const isFavorite = favorites.some((fav) => fav.id === movie.id);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
    } else {
      updatedFavorites = [...favorites, movie];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Box display="flex" justifyContent="center" sx={{ marginBottom: 2, marginTop: 3 }}>
        <FormControl sx={{ width: '10%' }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ marginTop: 3 }} />

      <Box display="flex" justifyContent="center" sx={{ marginBottom: 2 }}>
        <Button
          variant="outlined"
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </Button>
        <Typography variant="body1" sx={{ margin: '0 10px' }}>
          Page {page} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={3} key={movie.id}>
              <Card>
                <Box sx={{ position: 'relative' }}>
                  <Chip
                    label={category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 1,
                    }}
                  />
                  <CardMedia
                    component="img"
                    alt={movie.title}
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                    onClick={() => handleMovieClick(movie.id)}
                  />
                </Box>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="h6" align="center" sx={{ marginBottom: 1 }} noWrap>
                    {movie.title}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'black',
                      }}
                    >
                      <span style={{ fontSize: '1.5rem', color: 'gold' }}>★</span> {movie.vote_average}
                    </Typography>
                    <IconButton onClick={() => handleFavorite(movie)} disabled={!user}>
                      {favorites.some((fav) => fav.id === movie.id) ? (
                        <Favorite sx={{ color: 'red' }} />
                      ) : (
                        <FavoriteBorder />
                      )}
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

export default HomePage;
