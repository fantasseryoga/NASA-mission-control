const http = require('http')
require('dotenv').config()
const app = require('./app')
const { loadPlanetsData } = require('./models/planets.model')
const { mongoConnect } = require('./utils/mongo')

const PORT = process.env.PORT || 8000
const server = http.createServer(app)

async function startServer() {
    await mongoConnect()
    const planets = await loadPlanetsData()
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}

startServer()