const Get_Tip = Global_Functions.Get_Tip;
const Ambulance_Embed = Global_Functions.Ambulance_Embed;

function Get_Row(Word, Size) {
    var Status = "";

    for (var Current = 0; Current < Size; Current++) {
        Status = `${Status}||${Word}||`;
    }

    return Status;
}

module.exports = {
    name: "pop",
    aliases: ["hiddenpop"],
    category: "fun",
    setup: "pop",
    show_aliases: true,
    description: "idk just pop",

    async execute(Message, Message_Args, Client) {
        const Word = Message_Args.slice(0).join(" ") || "pop";
        var Status = null;

        if (Word.length > 50) return Message.channel.send({embeds: Ambulance_Embed(`${Message.author.toString()}, the word must be less than 20 characters.`)}) 

        for (var Current = 0; Current < 5; Current++) {
            Status = Status != null ? `${Status}\n${Get_Row(Word, 6)}` : Get_Row(Word, 6);
        }

        Message.channel.send(`${Get_Tip()}\n\n${Status}`);
    }
};