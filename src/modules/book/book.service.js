const prisma = require('../../config/prisma');

class BookService {
  async create(createBookDto) {
    try {
      const genres = await prisma.genre.findMany({
        where: { id: { in: createBookDto.genreIds } },
      });
      if (genres.length !== createBookDto.genreIds.length) {
        const error = new Error('One or more genres not found');
        error.status = 404;
        throw error;
      }

      return await prisma.book.create({
        data: {
          judul: createBookDto.judul,
          alt_judul: createBookDto.alt_judul,
          cover: createBookDto.cover,
          author: createBookDto.author,
          artist: createBookDto.artist,
          synopsis: createBookDto.synopsis,
          status: createBookDto.status,
          type: createBookDto.type,
          genres: {
            connect: createBookDto.genreIds.map((id) => ({ id })),
          },
        },
        include: {
          genres: {
            select: {
              id: true,
              nama: true,
            },
          },
          chapters: {
            select: {
              id: true,
              chapter: true,
              volume: true,
              nama: true,
              bookId: true,
              created_at: true,
              thumbnail: true,
            },
          },
        },
      });
    } catch (err) {
      const error = new Error(`Failed to create book: ${err.message}`);
      error.status = err.status || 500;
      throw error;
    }
  }

  async findAll(page, limit, sortBy = 'desc') {
    try {
      const skip = (page - 1) * limit;

      const books = await prisma.book.findMany({
        skip,
        take: limit,
        orderBy: {
          created_at: sortBy,
        },
        include: {
          genres: {
            select: {
              id: true,
              nama: true,
            },
          },
          chapters: {
            select: {
              id: true,
              chapter: true,
              volume: true,
              nama: true,
              bookId: true,
              created_at: true,
              thumbnail: true,
            },
          },
        },
      });

      const total = await prisma.book.count();

      return {
        data: books,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      const error = new Error(`Failed to fetch books: ${err.message}`);
      error.status = err.status || 500;
      throw error;
    }
  }

  async findOne(id) {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          genres: {
            select: {
              id: true,
              nama: true,
            },
          },
          chapters: {
            select: {
              id: true,
              chapter: true,
              volume: true,
              nama: true,
              bookId: true,
              created_at: true,
              thumbnail: true,
            },
          },
        },
      });
      if (!book) {
        const error = new Error(`Book with ID ${id} not found`);
        error.status = 404;
        throw error;
      }
      return book;
    } catch (err) {
      const error = new Error(`Failed to fetch book: ${err.message}`);
      error.status = err.status || 500;
      throw error;
    }
  }

  async update(id, updateBookDto) {
    try {
      await this.findOne(id);
      if (updateBookDto.genreIds) {
        const genres = await prisma.genre.findMany({
          where: { id: { in: updateBookDto.genreIds } },
        });
        if (genres.length !== updateBookDto.genreIds.length) {
          const error = new Error('One or more genres not found');
          error.status = 404;
          throw error;
        }
      }

      return await prisma.book.update({
        where: { id },
        data: {
          judul: updateBookDto.judul,
          alt_judul: updateBookDto.alt_judul,
          cover: updateBookDto.cover,
          author: updateBookDto.author,
          artist: updateBookDto.artist,
          synopsis: updateBookDto.synopsis,
          status: updateBookDto.status,
          type: updateBookDto.type,
          genres: updateBookDto.genreIds
            ? { set: updateBookDto.genreIds.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          genres: {
            select: {
              id: true,
              nama: true,
            },
          },
          chapters: {
            select: {
              id: true,
              chapter: true,
              volume: true,
              nama: true,
              bookId: true,
              created_at: true,
              thumbnail: true,
            },
          },
        },
      });
    } catch (err) {
      const error = new Error(`Failed to update book: ${err.message}`);
      error.status = err.status || 500;
      throw error;
    }
  }

  async remove(id) {
    try {
      await this.findOne(id);
      return await prisma.book.delete({ where: { id } });
    } catch (err) {
      const error = new Error(`Failed to delete book: ${err.message}`);
      error.status = err.status || 500;
      throw error;
    }
  }

  async findBySearchCombination(genreIds, search, creator, sortBy = 'desc', page = 1, limit = 10) {
    try {
      const noFilter =
        (!genreIds || genreIds.length === 0) &&
        (!search || search.trim() === '') &&
        (!creator || creator.trim() === '');

      if (noFilter) {
        return await this.findAll(page, limit, sortBy);
      }

      const filters = {};

      if (search) {
        filters.OR = [
          { judul: { contains: search, mode: 'insensitive' } },
          { alt_judul: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (creator) {
        filters.OR = [
          ...(filters.OR || []),
          { author: { contains: creator, mode: 'insensitive' } },
          { artist: { contains: creator, mode: 'insensitive' } },
        ];
      }

      if (genreIds && genreIds.length > 0) {
        filters.genres = {
          some: {
            id: { in: genreIds },
          },
        };
      }

      const skip = (page - 1) * limit;

      const books = await prisma.book.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: {
          created_at: sortBy,
        },
        include: {
          genres: {
            select: {
              id: true,
              nama: true,
            },
          },
          chapters: {
            select: {
              id: true,
              chapter: true,
              volume: true,
              nama: true,
              bookId: true,
              created_at: true,
              thumbnail: true,
            },
          },
        },
      });

      const total = await prisma.book.count({ where: filters });

      const finalBooks =
        genreIds && genreIds.length > 0
          ? books.filter((book) => {
              const bookGenreIds = book.genres.map((genre) => genre.id);
              return genreIds.every((id) => bookGenreIds.includes(id));
            })
          : books;

      return {
        data: finalBooks,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      const error = new Error(`Failed to search books: ${err.message}`);
      error.status = err.status || 500;
      throw error;
    }
  }
}

module.exports = new BookService();