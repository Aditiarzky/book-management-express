const prisma = require('../../config/prisma');
const bcrypt = require('bcrypt');

class UserService {
  async create(dto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      const error = new Error('Email already in use');
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email) {
    if (!email) {
      const error = new Error('Email is required');
      error.status = 400;
      throw error;
    }

    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id, updateUserDto) {
    const data = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id) {
    const user = await this.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return prisma.user.delete({ where: { id } });
  }
}

module.exports = new UserService();