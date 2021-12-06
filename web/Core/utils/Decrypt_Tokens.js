const Crypto = require("crypto-js");
const Encryption_Key = process.env.ENCRYPTION_KEY;

module.exports = {
    name: "Decrypt_Tokens",

    execute(Access_Token, Refresh_Token) {
        const Decrypted_Access_Token = Access_Token ? Crypto.AES.decrypt(Access_Token, Encryption_Key).toString(Crypto.enc.Utf8) : "";
        const Decrypted_Refresh_Token = Refresh_Token ? Crypto.AES.decrypt(Refresh_Token, Encryption_Key).toString(Crypto.enc.Utf8) : "";

        return {
            Access_Token: Decrypted_Access_Token,
            Refresh_Token: Decrypted_Refresh_Token,
        };
    },
};
