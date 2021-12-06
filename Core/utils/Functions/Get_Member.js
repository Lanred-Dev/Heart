const Discord = require("discord.js");
const Ambulance_Embed = require("../Ambulance_Embed_Self.js");

module.exports = {
    name: "Get_Member",

    execute(Interaction, Can_Be_Self, Can_Not_Be_Admin, Is_Self_String, Is_Admin_String, Ephemeral) {
        const User = Interaction.options.getUser("user");

        if (Can_Be_Self && !User) {
            return Interaction.member;
        } else if (!Can_Be_Self && User === Interaction.user) {
            Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.user.toString()}, ${Is_Self_String ? Is_Self_String : "you cant do that"}.`)], ephemeral: Ephemeral ? Ephemeral : false });

            return null;
        } else if (!User) {
            Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.user.toString()}, provide a user.`)], ephemeral: Ephemeral ? Ephemeral : false });

            return null;
        }

        const Member = Interaction.guild.members.cache.get(User.id);

        if (!Member) {
            Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.user.toString()}, provide a user.`)], ephemeral: Ephemeral ? Ephemeral : false });

            return null;
        } else if (Can_Not_Be_Admin && Can_Not_Be_Admin === true && Member.permissions.has(Discord.Permissions.FLAGS["ADMINISTRATOR"])) {
            Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.user.toString()}, ${Is_Admin_String ? Is_Admin_String : "you cant do that"}.`)], ephemeral: Ephemeral ? Ephemeral : false });

            return null;
        }

        return Member;
    },
};
