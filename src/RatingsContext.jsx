import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RatingsContext = createContext();

export const useRatings = () => {
  return useContext(RatingsContext);
};

export const RatingsProvider = ({ children }) => {
  const [ratedMovies, setRatedMovies] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const storedRatedMovies = JSON.parse(localStorage.getItem(`ratedMovies_${user.id}`)) || {};
      setRatedMovies(storedRatedMovies);
    } else {
      setRatedMovies({});
    }
  }, [user]);

  const updateRatedMovies = (newRatedMovies) => {
    if (user) {
      setRatedMovies(newRatedMovies);
      localStorage.setItem(`ratedMovies_${user.id}`, JSON.stringify(newRatedMovies));
    }
  };

  const updateRating = (movieId, newRating) => {
    if (user) {
      const updatedRatedMovies = { ...ratedMovies, [movieId]: { rating: newRating } };
      updateRatedMovies(updatedRatedMovies);
    }
  };

  const deleteRating = (movieId) => {
    if (user) {
      const updatedRatedMovies = { ...ratedMovies };
      delete updatedRatedMovies[movieId];
      updateRatedMovies(updatedRatedMovies);
    }
  };

  const logout = () => {
    setUser(null);
    setRatedMovies({});
    localStorage.removeItem('user');
    localStorage.removeItem(`ratedMovies_${user?.id}`);
    navigate('/login');
  };

  return (
    <RatingsContext.Provider value={{ ratedMovies, updateRating, deleteRating, user, logout }}>
      {children}
    </RatingsContext.Provider>
  );
};
