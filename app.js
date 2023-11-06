
const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()

const AuthRoute = require('./Routes/Auth.route')

const app = express()
app.use(morgan('dev'))

app.get('/', async (req, res, next) => {
    res.send('Hello from express.')
  })

  app.use(async (req, res, next) => {
    // Use next to execute the next middleware
    next(createError.NotFound())
  })
  
// error handling
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      error: {
        // If status is not there throw internal server error (500)
        status: err.status || 500, 
        message: err.message,
      },
    })
  })




const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
