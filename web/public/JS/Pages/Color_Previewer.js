(function () {
    Navbar.setAttribute("data-appear", "true");

    let Background = document.getElementById("Background");
    let Title = document.getElementById("Title");
    let Title_Under = document.getElementById("Title_Under");

    function Get_Link_Queries() {
        let Index = document.URL.indexOf('?');
        let Queries = {};

        if (Index != -1) {
            let Pairs = document.URL.substring(Index + 1, document.URL.length).split('&');

            for (let Current = 0; Current < Pairs.length; Current++) {
                let Name = Pairs[Current].split("=");

                Queries[Name[0]] = Name[1];
            }
        }

        return Queries;
    }

    function To_RGB(Hex) {
        const Result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);

        return Result ? {
            R: parseInt(Result[1], 16),
            G: parseInt(Result[2], 16),
            B: parseInt(Result[3], 16)
        } : {
            R: 0,
            G: 0,
            B: 0
        };
    }

    let Link_Queries = Get_Link_Queries();
    let Color = unescape(Link_Queries["color"]);
    var Color_RGB = To_RGB(Color);
    Color_RGB = `${Color_RGB.R}, ${Color_RGB.G}, ${Color_RGB.B}`;

    if (!Color || Color === "undefined") {
        Background.style["background"] = "#000000";
        Title.innerText = "#000000";
        Title_Under.innerText = "The most plain of them all.";
    } else {
        Background.style["background"] = `#${Color}`;
        Title.innerText = `#${Color}`;
        Title_Under.innerText = `rgb(${Color_RGB})`;
    }

    document.title = `#${Color} - Heart`;
})();