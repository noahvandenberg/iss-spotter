const request = require("request");
const SECRETS = require('./secrets');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */


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
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }
    
    return callback({
      latitude: JSON.parse(body).latitude,
      longitude: JSON.parse(body).longitude
    });
  
  });

};


module.exports = { fetchMyIP, fetchCoordsByIP };