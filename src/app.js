const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { requireAuth, revokeAuth } = require('./middleware/AuthMiddleware');

const UserRouter = require('./routes/UserRouter');
const AuthRouter = require('./routes/AuthRouter');
const ModelRouter = require('./routes/ModelRouter');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(AuthRouter);
app.use(UserRouter);
app.use(ModelRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        status: 'Failed',
        message: 'Something went wrong!'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    const serverUrl = `http://localhost:${PORT}`;
    console.log(`Server URL: ${serverUrl}`);
})