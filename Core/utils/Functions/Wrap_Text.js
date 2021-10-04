module.exports = {
    name: "Wrap_Text",

    execute(Context, text, X_Position, Y_Position, Max_Width, Line_Height) {
        var Words = text.split(" ");
        var Line = "";
        var Test;
        var Metrics;

        for (var Current = 0; Current < Words.length; Current++) {
            Test = Words[Current];
            Metrics = Context.measureText(Test);

            while (Metrics.width > Max_Width) {
                Test = Test.substring(0, Test.length - 1);
                Metrics = Context.measureText(Test);
            }

            if (Words[Current] != Test) {
                Words.splice(Current + 1, 0, Words[Current].substr(Test.length));

                Words[Current] = Test;
            }

            Test = Line + Words[Current] + " ";
            Metrics = Context.measureText(Test);

            if (Metrics.width > Max_Width && Current > 0) {
                Context.fillText(Line, X_Position, Y_Position);

                Line = Words[Current] + " ";
                Y_Position += Line_Height;
            } else {
                Line = Test;
            }
        }

        Context.fillText(Line, X_Position, Y_Position);
    }
};