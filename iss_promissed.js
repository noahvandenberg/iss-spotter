const request = require('request-promise-native');
const SECRETS = require('./secrets')

const fetchMyIp = () => {return request('https://api.ipify.org?format=json')}

const fetchCoordsByIP = (body) => {
  const ip = JSON.parse(body).ip;
  return request(`https://api.freegeoip.app/json/${ip}?apikey=${SECRETS.API_KEYS.Freegeoip}`)
}

const fetchISSFlyOverTimes = (body) => {
  const latitude = JSON.parse(body).latitude;
  const longitude = JSON.parse(body).longitude;
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`)
}

const nextISSTimesForMyLocation = (callback) => {
  return fetchMyIp()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(data => {
      return JSON.parse(data).response
    })

}

module.exports = {
  nextISSTimesForMyLocation
}