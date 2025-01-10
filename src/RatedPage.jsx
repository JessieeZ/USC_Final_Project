import React, { useEffect, useState } from 'react';
import { useRatings } from './RatingsContext';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const RatedPage = () => {
  const { ratedMovies, deleteRating } = useRatings();
  const [moviesData, setMoviesData] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const movieIds = Object.keys(ratedMovies);
      if (movieIds.length > 0) {
        const moviePromises = movieIds.map(async (movieId) => {
          try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=06ac932ac0d2f566714e74f87bd668ff`);
            const movieData = await response.json();
            return { ...movieData, rating: ratedMovies[movieId].rating, poster_path: movieData.poster_path || null };
          } catch (error) {
            console.error("Error fetching movie data:", error);
            return null;
          }
        });

        const movies = await Promise.all(moviePromises);
        setMoviesData(movies.filter(movie => movie !== null));
      }
    };

    fetchMovies();
  }, [ratedMovies]);

  const handleDelete = (movieId) => {
    deleteRating(movieId);
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Rated Movies</Typography>

      <Grid container spacing={3} justifyContent="left">
        {moviesData.length === 0 ? (
          <Typography variant="body1"></Typography>
        ) : (
          moviesData.map((movie) => (
            <Grid item xs={12} sm={6} md={3} key={movie.id}>
              <Card>
                <CardMedia
                  component="img"
                  alt={movie.title}
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                  }}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>{movie.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Avg Rating:</strong> {movie.vote_average} / 10
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Your Rating:</strong> {movie.rating} / 10
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => handleDelete(movie.id)}
                    sx={{ marginTop: 1 }}
                  >
                    Delete Rating
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default RatedPage;
