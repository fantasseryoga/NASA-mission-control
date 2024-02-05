const launchesDB = require('../models/launches.mongo')
const planetsDB = require('../models/planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100


const launch = {
    flightNumber: 100,
    mission: "Kepler investigation",
    rocket: "Explorer IS1",
    launchDate: new Date('December 22, 2032'),
    target: "Kepler-442 b",
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true
}

saveLaunch(launch)

async function getAllLaunches () {
    return await launchesDB.find({}, {
        _id: 0,
        __v: 0
    })
}

async function getLatestFilightNumber () {
    const latestlaunch = await launchesDB.findOne().sort('-flightNumber')

    if(!latestlaunch){
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestlaunch.flightNumber
}

async function existsLaunchById(launchId) {
    return await launchesDB.findOne({ flightNumber: launchId });
}

async function saveLaunch(launch) {
    const planet = await planetsDB.findOne({
        keplerName: launch.target
    })

    if(!planet){
        throw new Error('No matching planets was found for launch')
    }

    await launchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function scheduleNewLaunch(launch) {
    const newFlifhtNumber = await getLatestFilightNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        flightNumber: newFlifhtNumber,
        customers: ["ZTM", "NASA"]
    })

    await saveLaunch(newLaunch)
}

// function createNewLaunch(launch) {
//     flightNumberCounter++
//     launches.set(
//         flightNumberCounter,    
//         Object.assign(launch, {
//             flightNumber: flightNumberCounter,
//             success: true,
//             upcoming: true,
//             customers: ["ZTM", "NASA"]
//         })
//     )
// }

async function deleteLaunchesById(launchId) {
    const aborted = await launchesDB.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })
    
    return aborted.modifiedCount === 1
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchById,
    deleteLaunchesById
}