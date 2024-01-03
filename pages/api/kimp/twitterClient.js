const { TwitterApi } = require('twitter-api-v2');


//console.log( "in twitterClient line 4", process.env.APP_KEY, process.env.APP_SECRET, process.env.ACCESS_TOKEN, process.env.ACCESS_SECRET)

const userClient = new TwitterApi({
	appKey: process.env.APP_KEY,
	appSecret: process.env.APP_SECRET,
	// Following access tokens are not required if you are
	// at part 1 of user-auth process (ask for a request token)
	// or if you want a app-only client (see below)
	accessToken: process.env.ACCESS_TOKEN,
	accessSecret: process.env.ACCESS_SECRET,
  });
  //console.log( "in twitterClient", process.env.APP_KEY, process.env.APP_SECRET, process.env.ACCESS_TOKEN, process.env.ACCESS_SECRET)

  // OAuth2 (app-only or user context)
  // Create a client with an already known bearer token
 	const bearer = new TwitterApi(process.env.BEARER_TOKEN);
  // OR - you can also create a app-only client from your consumer keys -

 // const appOnlyClientFromConsumer = await userClient.appLogin();

module.exports = { userClient, bearer };