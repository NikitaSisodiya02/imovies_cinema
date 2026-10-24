import { getShows as dbGetShows, getShowById as dbGetShowById, createShow as dbCreateShow, deleteShow as dbDeleteShow, getSeatsByShow } from '../services/dataStore.js';

export const getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, date } = req.query;
    const shows = await dbGetShows({ movieId, theatreId, date });
    res.status(200).json({ success: true, count: shows.length, shows });
  } catch (err) {
    next(err);
  }
};

export const getShow = async (req, res, next) => {
  try {
    const show = await dbGetShowById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    const seats = await getSeatsByShow(show._id);
    res.status(200).json({ success: true, show, seats });
  } catch (err) {
    next(err);
  }
};

export const createShow = async (req, res, next) => {
  try {
    const show = await dbCreateShow(req.body);
    res.status(201).json({ success: true, show });
  } catch (err) {
    next(err);
  }
};

export const deleteShow = async (req, res, next) => {
  try {
    const success = await dbDeleteShow(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.status(200).json({ success: true, message: 'Show deleted' });
  } catch (err) {
    next(err);
  }
};
