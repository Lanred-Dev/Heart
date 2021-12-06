const Crypto = require("crypto-js");
const Encryption_Key = process.env.ENCRYPTION_KEY;

module.exports = {
    name: "Encrypt_Tokens",

    execute(Access_Token, Refresh_Token) {
        const Encrypted_Access_Token = Access_Token ? Crypto.AES.encrypt(Access_Token, Encryption_Key).toString() : "";
        const Encrypted_Refresh_Token = Refresh_Token ? Crypto.AES.encrypt(Refresh_Token, Encryption_Key).toString() : "";

        return {
            Access_Token: Encrypted_Access_Token,
            Refresh_Token: Encrypted_Refresh_Token,
        };
    },
};
