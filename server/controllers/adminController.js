import { getAdminStats } from '../services/dataStore.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getAdminStats();
    res.status(200).json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};
