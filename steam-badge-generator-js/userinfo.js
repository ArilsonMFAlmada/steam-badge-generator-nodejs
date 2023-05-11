const axios = require('axios');

async function get_user_info(steam_id) {
  const max_retries = 3;
  let retry_count = 0;

  while (retry_count < max_retries) {
    try {
      const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=354FE0F772D87A675323E45C5C8350AD&steamids=${steam_id}`;
      const response = await axios.get(url, { timeout: 5000 });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        retry_count += 1;
        if (retry_count === max_retries) {
          return {
            statusCode: 500,
            body: 'The request to the Steam API timed out after multiple retries.',
          };
        }
      } else {
        return {
          statusCode: 500,
          body: 'An error occurred while fetching user information.',
        };
      }
    }
  }
}

module.exports = {
    get_user_info,
  };
