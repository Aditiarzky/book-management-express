require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const bookRoutes = require('./modules/book/book.route');
const chapterRoutes = require('./modules/chapter/chapter.route');
const genreRoutes = require('./modules/genre/genre.route');
const authRoutes = require('./modules/auth/auth.route');
const userRoutes = require('./modules/user/user.route');
const responseTransform = require('./middleware/responseTransform');
const globalException = require('./middleware/globalException');

const app = express();

// === CORS SETUP ===
const PROD_WHITELIST = [
  'https://riztranslation.rf.gd',
  'https://www.riztranslation.rf.gd'
];
const DEV_WHITELIST = [/^localhost(:\d+)?$/];

app.use(cors({
  origin: (origin, callback) => {
    // allow tools (no origin header)
    if (!origin) {
      return callback(null, true);
    }

    let isAllowed = false;
    if (PROD_WHITELIST.includes(origin)) {
      isAllowed = true;
    } else {
      try {
        const host = new URL(origin).hostname;
        isAllowed = DEV_WHITELIST.some(rx => rx.test(host));
      } catch {
        return callback(new Error('Invalid origin'));
      }
    }

    if (isAllowed) {
      // echo back the exact origin header the browser sent
      return callback(null, origin);
    } else {
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
// === END CORS SETUP ===

// Middleware untuk parsing JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware untuk logging (membantu debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(responseTransform);

app.get('/', (req, res) => {
  res.json({ message: 'API is online!' });
});

app.use('/api/books', bookRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(globalException);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});