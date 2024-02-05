const API_URL = "http://localhost:8000"

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`)
  return await response.json()
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`)
  const fetchedlaunches = await response.json()
  return fetchedlaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: 'POST',
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (err) {
    console.log(err)
    return {
      ok: false
    }
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try{
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'DELETE',
    })
  } catch (err) {
    console.log(err)
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};