const prisma = require('../../config/prisma');

class ChapterService {
  async create(createChapterDto) {
    const book = await prisma.book.findUnique({ where: { id: createChapterDto.bookId } });
    if (!book) {
      const error = new Error(`Book with ID ${createChapterDto.bookId} not found`);
      error.status = 404;
      throw error;
    }

    // Pastikan chapter di-convert ke float
    const chapterFloat = parseFloat(createChapterDto.chapter);

    return prisma.chapter.create({
      data: {
        book: { connect: { id: createChapterDto.bookId } },
        chapter: chapterFloat,
        volume: createChapterDto.volume,
        nama: createChapterDto.nama,
        thumbnail: createChapterDto.thumbnail,
        isigambar: createChapterDto.isigambar,
        isitext: createChapterDto.isitext,
      },
    });
  }

  async findAll(page, limit, sortBy = 'desc') {
    const skip = (page - 1) * limit;

    const chapters = await prisma.chapter.findMany({
      skip,
      take: limit,
      orderBy: {
        created_at: sortBy,
      },
      include: { book: true },
    });

    const total = await prisma.chapter.count();

    return {
      data: chapters,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const chapter = await prisma.chapter.findFirst({
      where: { id },
      include: { book: true },
    });

    if (!chapter) {
      const error = new Error(`Chapter with ID ${id} not found`);
      error.status = 404;
      throw error;
    }
    return chapter;
  }

  async findOne(id, bookId) {
    const chapter = await prisma.chapter.findFirst({
      where: {
        id,
        bookId,
      },
      include: { book: true },
    });

    if (!chapter) {
      const error = new Error(`Chapter with ID ${id} and Book ID ${bookId} not found`);
      error.status = 404;
      throw error;
    }
    return chapter;
  }

  async findByBook(bookId, sortBy = 'desc') {
    const chapters = await prisma.chapter.findMany({
      where: { bookId },
      orderBy: [
        { volume: sortBy },
        { chapter: sortBy },
      ],
      include: { book: true },
    });

    if (chapters.length === 0) {
      const error = new Error(`No chapters found for Book ID ${bookId}`);
      error.status = 404;
      throw error;
    }
    return chapters;
  }

  async getLatestChapters(page, limit, sortBy = 'desc') {
    const skip = (page - 1) * limit;

    const latestChapterIds = await prisma.$queryRaw`
      SELECT c.id
      FROM "Chapter" c
      INNER JOIN (
          SELECT "bookId", MAX(created_at) AS max_created_at
          FROM "Chapter"
          GROUP BY "bookId"
      ) AS latest ON c."bookId" = latest."bookId" AND c.created_at = latest.max_created_at
    `;

    const chapterIds = latestChapterIds.map((c) => c.id);

    const chapters = await prisma.chapter.findMany({
      where: {
        id: {
          in: chapterIds,
        },
      },
      skip,
      take: limit,
      orderBy: {
        created_at: sortBy,
      },
      include: { book: true },
    });

    const total = chapterIds.length;

    return {
      data: chapters,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id, updateChapterDto) {
    await this.findOne(id, updateChapterDto.bookId ?? 0);

    if (updateChapterDto.bookId) {
      const book = await prisma.book.findUnique({ where: { id: updateChapterDto.bookId } });
      if (!book) {
        const error = new Error(`Book with ID ${updateChapterDto.bookId} not found`);
        error.status = 404;
        throw error;
      }
    }

    // Pastikan chapter di-convert ke float jika ada
    const updateData = {
      book: updateChapterDto.bookId ? { connect: { id: updateChapterDto.bookId } } : undefined,
      volume: updateChapterDto.volume,
      nama: updateChapterDto.nama,
      thumbnail: updateChapterDto.thumbnail,
      isigambar: updateChapterDto.isigambar,
      isitext: updateChapterDto.isitext,
    };

    if (updateChapterDto.chapter !== undefined) {
      updateData.chapter = parseFloat(updateChapterDto.chapter);
    }

    return prisma.chapter.update({
      where: { id },
      data: updateData,
      include: { book: true },
    });
  }

  async remove(id) {
    await this.findById(id);
    return prisma.chapter.delete({ where: { id } });
  }
}

module.exports = new ChapterService();