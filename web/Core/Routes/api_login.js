const Redirect_URI = encodeURIComponent("http://localhost:3000/api/auth/callback");
const Client_ID = process.env.CLIENT_ID;

module.exports = {
    file: "api/login",
    path: "/login",
    redirect: `https://discordapp.com/api/oauth2/authorize?client_id=${Client_ID}&scope=identify&response_type=code&redirect_uri=${Redirect_URI}&scope=guilds%20identify`
};