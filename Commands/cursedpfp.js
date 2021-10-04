const DiscordAPI = require("discord.js");
const CanvasAPI = require("canvas");
const Get_Member = Global_Functions.Get_Member;

function Embed() {
    const Embed = new DiscordAPI.MessageEmbed()
        .setDescription(":eyes:")
        .setImage("attachment://pfp.png")
        .setColor(Global_Embed_Color);

    return Embed;
}

module.exports = {
    name: "cursedpfp",
    aliases: ["cursedavatar"],
    category: "meme",
    setup: "cursedpfp [User]",
    show_aliases: true,
    description: "nothing to say about this one",

    async execute(Message, Message_Args, Client) {
        const Member = Get_Member(Message, Message_Args, true);

        if (!Member) return;

        const Canvas = CanvasAPI.createCanvas(128, 128);
        const Context = Canvas.getContext("2d");
        const Avatar = await CanvasAPI.loadImage(Member.user.displayAvatarURL({
            format: "jpg"
        }));

        Context.drawImage(Avatar, 0, 0, 128, 128);

        var Intensity = Math.floor(Math.random() * 85);

        if (Intensity < 55) {
            Intensity = 55;
        }

        var Radius = Math.floor(Math.random() * 15);

        if (Radius < 8) {
            Radius = 8;
        }

        const Image_Data = Context.getImageData(0, 0, Canvas.width, Canvas.height);
        var Pixels = Image_Data.data;
        var Intensity_LUT = [];
        var RGB_LUT = [];
        var Pixel_Intensity_Count = [];

        for (var Current_Y = 0; Current_Y < Canvas.height; Current_Y++) {
            Intensity_LUT[Current_Y] = [];
            RGB_LUT[Current_Y] = [];

            for (var Current_X = 0; Current_X < Canvas.width; Current_X++) {
                const Added = (Current_Y * Canvas.width + Current_X) * 4;
                const R = Pixels[Added];
                const G = Pixels[Added + 1];
                const B = Pixels[Added + 2];
                const Average = (R + G + B) / 3;

                Intensity_LUT[Current_Y][Current_X] = Math.round((Average * Intensity) / 255);
                RGB_LUT[Current_Y][Current_X] = {
                    r: R,
                    g: G,
                    b: B
                };
            }
        }


        for (Current_Y = 0; Current_Y < Canvas.height; Current_Y++) {
            for (Current_X = 0; Current_X < Canvas.width; Current_X++) {
                Pixel_Intensity_Count = [];

                for (var Current_Secondary_Y = -Radius; Current_Secondary_Y <= Radius; Current_Secondary_Y++) {
                    for (var Current_Secondary_X = -Radius; Current_Secondary_X <= Radius; Current_Secondary_X++) {
                        if (Current_Y + Current_Secondary_Y > 0 && Current_Y + Current_Secondary_Y < Canvas.height && Current_X + Current_Secondary_X > 0 && Current_X + Current_Secondary_X < Canvas.width) {
                            const Intensity_Value = Intensity_LUT[Current_Y + Current_Secondary_Y][Current_X + Current_Secondary_X];

                            if (!Pixel_Intensity_Count[Intensity_Value]) {
                                Pixel_Intensity_Count[Intensity_Value] = {
                                    value: 1,
                                    r: RGB_LUT[Current_Y + Current_Secondary_Y][Current_X + Current_Secondary_X].r,
                                    g: RGB_LUT[Current_Y + Current_Secondary_Y][Current_X + Current_Secondary_X].g,
                                    b: RGB_LUT[Current_Y + Current_Secondary_Y][Current_X + Current_Secondary_X].b
                                }
                            } else {
                                Pixel_Intensity_Count[Intensity_Value].value++;
                                Pixel_Intensity_Count[Intensity_Value].r += RGB_LUT[Current_Y + Current_Secondary_Y][Current_X + Current_Secondary_X].r;
                                Pixel_Intensity_Count[Intensity_Value].g += RGB_LUT[Current_Y + Current_Secondary_Y][Current_X + Current_Secondary_X].g;
                                Pixel_Intensity_Count[Intensity_Value].b += RGB_LUT[Current_Y + Current_Secondary_Y][Current_X + Current_Secondary_X].b;
                            }
                        }
                    }
                }

                Pixel_Intensity_Count.sort(function (Value_1, Value_2) {
                    return Value_1.value - Value_2.value;
                });

                const Value = Pixel_Intensity_Count[0].value;
                const Added = (Current_Y * Canvas.width + Current_X) * 4;

                Pixels[Added] = ~~(Pixel_Intensity_Count[0].r / Value);
                Pixels[Added + 1] = ~~(Pixel_Intensity_Count[0].g / Value);
                Pixels[Added + 2] = ~~(Pixel_Intensity_Count[0].b / Value);
                Pixels[Added + 3] = 255;
            }
        }

        Context.putImageData(Image_Data, 0, 0);

        Message.channel.send({
            embeds: [Embed()],
            files: [new DiscordAPI.MessageAttachment(Canvas.toBuffer(), "pfp.png")]
        });
    }
};