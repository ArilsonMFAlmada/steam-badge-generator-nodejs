const axios = require('axios');

async function get_game_trophies(steamId, appId) {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=354FE0F772D87A675323E45C5C8350AD&steamids&steamid=${steamId}`;
      const response = await axios.get(url, { timeout: 5000 });
      return response.data;

    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        retryCount += 1;
        if (retryCount === maxRetries) {
          return {
            statusCode: 500,
            body: 'The request to the Steam API timed out after multiple retries.'
          };
        }
      } else {
        return {
          statusCode: 500,
          body: 'An error occurred while fetching user trophies information.'
        };
      }
    }
  }
}

module.exports = {
    get_game_trophies,
  };
