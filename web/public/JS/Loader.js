(function () {
    const Loading_Screen = document.getElementById("Loading_Screen");
    const Page_Content = document.getElementById("Page_Content");
    const Loading_Screen_Icon = document.getElementById("Loading_Screen_Icon");

    Page_Content.style["display"] = "none";
    Loading_Screen.style["display"] = "flex";

    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            Loading_Screen_Icon.style["width"] = "250px";
            Loading_Screen_Icon.style["height"] = "250px";
            Loading_Screen_Icon.style["background"] = "var(--Color_1)";
            Loading_Screen_Icon.style["border-radius"] = "50%";
            Loading_Screen_Icon.style["transition"] = "width 1s, height 1s, opacity 0.8s, background 0.3s";

            setTimeout(function () {
                Loading_Screen_Icon.style["opacity"] = "0";
            }, 400);

            setTimeout(function () {
                Page_Content.style["display"] = "block";
                Loading_Screen.style["opacity"] = "1";
                Page_Content.style["opacity"] = "0";
                Page_Content.style["transition"] = "opacity 1s";
                Loading_Screen.style["transition"] = "opacity 1s";
            }, 1000);

            setTimeout(function () {
                Loading_Screen.style["opacity"] = "0";
                Page_Content.style["opacity"] = "1";
            }, 1010);

            setTimeout(function () {
                Loading_Screen.style["display"] = "none";
            }, 2010);
        }, 1000);
    });
})();