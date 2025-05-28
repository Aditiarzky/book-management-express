const authService = require('./auth.service');

const login = async (req, res, next) => {
  try {
    const user = await authService.validateUser(req.body.email, req.body.password);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const token = await authService.login(user);
    res.cookie('authToken', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      path: '/',
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      path: '/',
    });
    res.json({ message: 'Logout successful' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  logout,
};