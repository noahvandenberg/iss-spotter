const request = require("request");
const SECRETS = require('./secrets');


const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error,response,body) => {
    
    if (error) return callback(error, null);
    
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    return callback(null,JSON.parse(body).ip);

  });
};


const fetchCoordsByIP = (ip,callback) => {

  request(`https://api.freegeoip.app/json/${ip}?apikey=${SECRETS.API_KEYS.Freegeoip}`, (error,response,body) => {

    if (error) return callback(error, null);
    
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching GEO Coords. Response: ${body}`;
      return callback(Error(msg), null);
    }
    
    return callback(null,{
      latitude: JSON.parse(body).latitude,
      longitude: JSON.parse(body).longitude
    });
  
  });

};


const fetchISSFlyOverTimes = (coords, callback) => {

  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error,response,body) => {
    
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
  
    return callback(null, JSON.parse(body).response);
  });

};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };