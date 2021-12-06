const Ambulance_Embed = require("../Ambulance_Embed_Self.js");

module.exports = {
    name: "Get_Role",

    execute(Interaction, Ephemeral) {
        const Role = Interaction.options.getRole("role");

        if (!Role) {
            Interaction.reply({ embeds: [Ambulance_Embed(`${Interaction.user.toString()}, provide a role.`)], ephemeral: Ephemeral ? Ephemeral : false });

            return null;
        }

        return Role;
    },
};
