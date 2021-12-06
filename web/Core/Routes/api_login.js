const Redirect_URI = encodeURIComponent(process.env.REDIRECT_URI);
const OAUTH_Scopes = process.env.OUATH_SCOPES;
const Client_ID = process.env.CLIENT_ID;

module.exports = {
	file: "api/login",
	path: "/login",
	redirect: `https://discordapp.com/api/oauth2/authorize?client_id=${Client_ID}&scope=identify&response_type=code&redirect_uri=${Redirect_URI}&scope=${OAUTH_Scopes}`,
};
