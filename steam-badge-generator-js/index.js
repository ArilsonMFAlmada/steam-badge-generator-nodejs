const gameinfo = require('gameinfo');
const gametrophies = require('gametrophies');
const userinfo = require('userinfo');

exports.handler = async (event) => {
  console.log(`Received event: ${JSON.stringify(event)}`);

  const steam_id = String(event.steam_id);
  const app_id = String(event.app_id);

  const generate_badge = async (steam_id, app_id) => {
    console.log('fetching user information');
    const user_info = await userinfo.get_user_info(steam_id);

    console.log('fetching user trophies information');
    const game_trophies = await gametrophies.get_game_trophies(steam_id, app_id);

    console.log('fetching game information');
    const game_info = await gameinfo.get_game_info(app_id);
    const game_name = game_info[app_id].data.name;

    if (game_trophies.playerstats.achievements) {
      let all_trophies = true;
      for (const trophy of game_trophies.playerstats.achievements) {
        if (trophy.achieved === 0) {
          all_trophies = false;
          break;
        }
      }

      if (all_trophies) {
        console.log('drawing the badge');

        return {
          statusCode: 200,
          body: JSON.stringify(`Congratulations ${user_info.response.players[0].personaname}! You have earned the All Trophies badge for the game ${game_name}`),
          headers: {
            'Content-Type': 'application/json'
          }
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify(`Sorry ${user_info.response.players[0].personaname}, you haven't unlocked all the trophies for the game ${game_name}, so you didn't get the badge`),
          headers: {
            'Content-Type': 'application/json'
          }
        };
      }
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify('No trophies found for this game.'),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
  };

  return generate_badge(steam_id, app_id);
};
