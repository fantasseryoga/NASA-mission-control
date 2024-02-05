const request = require("supertest")
const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require('../../utils/mongo')
const { loadPlanetsData } = require('../../models/planets.model')


describe('LAUNCHES API', () => {
    beforeAll(async () => {
        await mongoConnect()
        await loadPlanetsData()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe('Test get /launches', () => {
        test('It should respond with status 200 success', async () => {
            const response = await request(app)
                .get('/launches')
                .expect('Content-Type', /json/)
                .expect(200)
        })
    })

    describe('Test post /launces', () => {
        const completeLaunchData = {
            mission: "Kepler USS exlore",
            rocket: "SS rocket",
            target: "Kepler-442 b",
            launchDate: "January 4, 2032"
        }

        const LaunchDateInvalidDate = {
            mission: "Kepler USS exlore",
            rocket: "SS rocket",
            target: "Kepler-62 f",
            launchDate: "zask"
        }

        const LaucnhDataNoDate = {
            mission: "Kepler USS exlore",
            rocket: "SS rocket",
            target: "Kepler-442 b",
        }


        test('It should respond with status 201 created', async () => {
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201)

            const requestDate = new Date(completeLaunchData.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()

            expect(requestDate).toBe(responseDate)
        })

        test('It should catch missing properties', async () => {
            const response = await request(app)
                .post('/launches')
                .send(LaucnhDataNoDate)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: "Missing required launch property"
            })
        })

        test('It should catch invalid date', async () => {
            const response = await request(app)
                .post('/launches')
                .send(LaunchDateInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: "Invalid Date"
            })
        })
    })
})