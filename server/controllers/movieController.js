import {
  getAllMovies,
  getMovieById,
  createMovie as dbCreateMovie,
  updateMovie as dbUpdateMovie,
  deleteMovie as dbDeleteMovie,
  getShows,
} from '../services/dataStore.js';

export const getMovies = async (req, res, next) => {
  try {
    const { genre, language, status, search } = req.query;
    const movies = await getAllMovies({ genre, language, status, search });
    res.status(200).json({ success: true, count: movies.length, movies });
  } catch (err) {
    next(err);
  }
};

export const getMovie = async (req, res, next) => {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Also get upcoming shows for this movie
    const shows = await getShows({ movieId: movie._id });

    res.status(200).json({ success: true, movie, shows });
  } catch (err) {
    next(err);
  }
};

export const createMovie = async (req, res, next) => {
  try {
    const movie = await dbCreateMovie(req.body);
    res.status(201).json({ success: true, movie });
  } catch (err) {
    next(err);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await dbUpdateMovie(req.params.id, req.body);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.status(200).json({ success: true, movie });
  } catch (err) {
    next(err);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const deleted = await dbDeleteMovie(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.status(200).json({ success: true, message: 'Movie deleted successfully' });
  } catch (err) {
    next(err);
  }
};
