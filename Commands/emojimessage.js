const { SlashCommandBuilder } = require("@discordjs/builders");
const Get_Tip = Global_Functions.Get_Tip;
const Embed = Global_Functions.Base_Embed;
const Conversions = {
    a: ":regional_indicator_a:",
    b: ":regional_indicator_b:",
    c: ":regional_indicator_c:",
    d: ":regional_indicator_d:",
    e: ":regional_indicator_e:",
    f: ":regional_indicator_f:",
    g: ":regional_indicator_g:",
    h: ":regional_indicator_h:",
    i: ":regional_indicator_i:",
    j: ":regional_indicator_j:",
    k: ":regional_indicator_k:",
    l: ":regional_indicator_l:",
    m: ":regional_indicator_m:",
    n: ":regional_indicator_n:",
    o: ":regional_indicator_o:",
    p: ":regional_indicator_p:",
    q: ":regional_indicator_q:",
    r: ":regional_indicator_r:",
    s: ":regional_indicator_s:",
    t: ":regional_indicator_t:",
    u: ":regional_indicator_u:",
    v: ":regional_indicator_v:",
    w: ":regional_indicator_w:",
    x: ":regional_indicator_x:",
    y: ":regional_indicator_y:",
    z: ":regional_indicator_z:",
    0: ":zero:",
    1: ":one:",
    2: ":two:",
    3: ":three:",
    4: ":four:",
    5: ":five:",
    6: ":six:",
    7: ":seven:",
    8: ":eight:",
    9: ":nine:",
    "#": ":hash:",
    "*": ":asterisk:",
};

module.exports = {
    info: new SlashCommandBuilder()
        .setName("emojimessage")
        .setDescription("Will turn your message into an emoji :O")
        .addStringOption((Option) => Option.setName("string").setDescription("The string").setRequired(true)),
    category: "fun",

    async execute(Interaction, Client) {
        const Unconverted = Interaction.options.getString("string");
        let Converted = "";

        for (let Current = 0; Current < Unconverted.length; Current++) {
            if (/\s/.test(Unconverted.charAt(Current))) {
                Converted = `${Converted} `;
            } else {
                if (Conversions[Unconverted.charAt(Current).toLowerCase()]) {
                    Converted = `${Converted}${Conversions[Unconverted.charAt(Current).toLowerCase()]}`;
                } else {
                    Converted = `${Converted}${Unconverted.charAt(Current).toLowerCase()}`;
                }
            }
        }

        Interaction.reply({content: Get_Tip(), embeds: [Embed(Converted)]});
    },
};
