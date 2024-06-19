const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./middleware/AuthMiddleware');

const UserRouter = require('./routes/UserRouter');
const AuthRouter = require('./routes/AuthRouter');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

app.use('/auth', AuthRouter);
app.use('/users', requireAuth, UserRouter);

app.use((req, res, next) => {
    res.status(404).send({
        status: 'Failed',
        message: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        status: 'Failed',
        message: 'Something went wrong!'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});