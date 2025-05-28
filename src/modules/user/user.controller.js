const userService = require('./user.service');

const register = async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.findById(req.user.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.update(req.user.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    await userService.remove(req.user.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  getProfile,
  updateProfile,
  deleteProfile,
};