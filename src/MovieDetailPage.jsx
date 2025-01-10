import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, CircularProgress, Box, Chip, MenuItem, Select, InputLabel, FormControl, Button, Grid, Avatar } from '@mui/material';
import { useRatings } from './RatingsContext';

const MovieDetailPage = ({ sessionId }) => {
  const { movieId } = useParams();
  const { ratedMovies, updateRating, deleteRating } = useRatings();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(null);
  const [tempRating, setTempRating] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=06ac932ac0d2f566714e74f87bd668ff`);
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();

    const ratedMovie = ratedMovies[movieId];
    if (ratedMovie) {
      setRating(ratedMovie.rating);
    }
  }, [movieId, ratedMovies]);

  const handleRatingChange = (event) => {
    setTempRating(event.target.value);
  };

  const handleRateItClick = () => {
    setRating(tempRating);
    updateRating(movieId, tempRating);
  };

  const handleDeleteRating = () => {
    deleteRating(movieId);
    setRating(null);
    setTempRating(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      {movie && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CardMedia
              component="img"
              alt={movie.title}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              sx={{
                height: 'auto',
                width: '100%',
                objectFit: 'contain',
              }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <Card>
              <CardContent>
                <Typography variant="h4">{movie.title}</Typography>
                <Typography variant="h6" sx={{ marginTop: 1 }}>Release Date: {movie.release_date}</Typography>
                <Typography variant="h6" sx={{ marginTop: 2 }}>Overview:</Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  {movie.overview}
                </Typography>

                <Typography variant="h6" sx={{ marginTop: 2 }}>Genres:</Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  {movie.genres?.map((genre) => (
                    <Chip key={genre.id} label={genre.name} sx={{ marginRight: 1 }} />
                  ))}
                </Typography>

                <Typography variant="h6" sx={{ marginTop: 2 }}>Average Rating:</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'black',
                  }}
                >
                  <span style={{ fontSize: '1.75rem', color: 'gold' }}>★</span> {movie.vote_average}
                </Typography>

                <Typography variant="h6" sx={{ marginTop: 2 }}>Your Rating:</Typography>
                <Typography variant="body1">
                  {rating ? `${rating} / 10` : 'Not Yet Rated'}
                </Typography>

                <FormControl sx={{ marginTop: 1, minWidth: 120 }} size="small">
                  <InputLabel id="rating-label">Rate</InputLabel>
                  <Select
                    labelId="rating-label"
                    value={tempRating || ''}
                    label="Rate"
                    onChange={handleRatingChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rate) => (
                      <MenuItem key={rate} value={rate}>
                        {rate}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleRateItClick}
                  sx={{ marginTop: '10px' }}
                >
                  Rate It
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDeleteRating}
                  sx={{ marginTop: '10px' }}
                >
                  Delete Rating
                </Button>

                <Typography variant="h6" sx={{ marginTop: 2 }}>Production Companies:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 1 }}>
                  {movie.production_companies?.map((company) => (
                    company.logo_path && (
                      <Avatar
                        key={company.id}
                        alt={company.name}
                        src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                        sx={{
                          marginRight: 2,
                          marginBottom: 1,
                          width: 50,
                          height: 50,
                          objectFit: 'contain',
                        }}
                      />
                    )
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MovieDetailPage;
