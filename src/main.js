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

const allowedOrigins =  [
  'http://localhost:5173', 
  'https://riztranslation.rf.gd', 
  'http://riztranslation.rf.gd', 
  'https://www.riztranslation.rf.gd', 
  'http://www.riztranslation.rf.gd'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

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