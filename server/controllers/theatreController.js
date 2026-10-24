import { getAllTheatres, getTheatreById, createTheatre as dbCreateTheatre, getShows } from '../services/dataStore.js';

export const getTheatres = async (req, res, next) => {
  try {
    const { city, search } = req.query;
    const theatres = await getAllTheatres({ city, search });
    res.status(200).json({ success: true, count: theatres.length, theatres });
  } catch (err) {
    next(err);
  }
};

export const getTheatre = async (req, res, next) => {
  try {
    const theatre = await getTheatreById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }
    const shows = await getShows({ theatreId: theatre._id });
    res.status(200).json({ success: true, theatre, shows });
  } catch (err) {
    next(err);
  }
};

export const createTheatre = async (req, res, next) => {
  try {
    const theatre = await dbCreateTheatre(req.body);
    res.status(201).json({ success: true, theatre });
  } catch (err) {
    next(err);
  }
};
