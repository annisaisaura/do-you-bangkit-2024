const express = require('express')
const { requireAuth, revokeAuth } = require('./middlewares/AuthMiddleware')

const app = express()
// const UserRouter = require('./routes/UserRouter')
const UserRouter = require('./routes/UserRouter')
const AuthRouter = require('./routes/AuthRouter')
const FoodRouter = require('./routes/FoodRouter')
const MLRouter = require('./routes/MLRouter')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

app.use(AuthRouter)
app.use(UserRouter)
app.use(requireAuth, revokeAuth, FoodRouter)
app.use(requireAuth, revokeAuth, MLRouter)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    const serverUrl = `http://localhost:${PORT}`;
    console.log(`Server URL: ${serverUrl}`);
})