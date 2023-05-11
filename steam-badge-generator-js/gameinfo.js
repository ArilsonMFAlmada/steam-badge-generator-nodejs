const axios = require('axios');

async function get_game_info(app_id) {
  const max_retries = 3;
  let retry_count = 0;

  while (retry_count < max_retries) {
    try {
      const url = `https://store.steampowered.com/api/appdetails/?appids=${app_id}`;
      const response = await axios.get(url, { timeout: 5000 });
      return response.data;

    } catch (error) {
      if (error.code === 'ECONNABORTED') {s
        retry_count++;
        if (retry_count === max_retries) {
          return {
            statusCode: 500,
            body: 'The request to the Steam API timed out after multiple retries.'
          };
        }
      } else {
        return {
          statusCode: 500,
          body: 'An error occurred while fetching game information.'
        };
      }
    }
  }
}

module.exports = {
    get_game_info,
  };
