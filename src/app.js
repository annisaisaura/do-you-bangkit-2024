const express = require('express');
const bodyParser = require('body-parser');
const UserRouter = require('./routes/UserRouter');
const AuthRouter = require('./routes/AuthRouter');
const CareerRouter = require('./routes/CareerRouter');
const authenticateToken = require('./middleware/AuthMiddleware');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(UserRouter);
app.use(AuthRouter);
app.use(authenticateToken);
app.use(CareerRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});