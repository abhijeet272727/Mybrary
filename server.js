
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

// EJS configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');

// Middleware
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: false
}));

// Routes
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

// Start server after connecting to MongoDB
async function startServer() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable is missing');
        }

        await mongoose.connect(process.env.DATABASE_URL);

        console.log('Connected to Mongoose');

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server Started on Port ${PORT}`);
        });
    } catch (error) {
        console.error('Application startup failed:', error.message);
        process.exit(1);
    }
}

startServer();
