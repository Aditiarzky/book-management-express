const prisma = require('../../config/prisma');

class GenreService {
  async create(createGenreDto) {
    console.log('Creating genre with data:', createGenreDto);
    return prisma.genre.create({
      data: {
        nama: createGenreDto.nama,
        deskripsi: createGenreDto.deskripsi || null,
      },
    });
  }

  async findAll() {
    return prisma.genre.findMany({
      orderBy: { nama: 'asc' },
      include: { books: true },
    });
  }

  async findOne(id) {
    const genre = await prisma.genre.findUnique({
      where: { id },
      include: { books: true },
    });
    if (!genre) {
      const error = new Error(`Genre with ID ${id} not found`);
      error.status = 404;
      throw error;
    }
    return genre;
  }

  async update(id, updateGenreDto) {
    await this.findOne(id);
    return prisma.genre.update({
      where: { id },
      data: {
        nama: updateGenreDto.nama,
        deskripsi: updateGenreDto.deskripsi,
      },
    });
  }

  async remove(id) {
    await this.findOne(id);
    return prisma.genre.delete({ where: { id } });
  }
}

module.exports = new GenreService();