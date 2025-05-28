const userService = require('../user/user.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthService {
  async validateUser(email, password) {
    const user = await userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user) {
    const payload = { email: user.email, sub: user.id };
    const JWT_SECRET = process.env.SECRET_KEY;
    if (!JWT_SECRET) {
      throw new Error('SECRET_KEY environment variable is not set');
    }
    return {
      access_token: jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }),
    };
  }
}

module.exports = new AuthService();