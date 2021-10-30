(function () {
    const Simplebar = new SimpleBar(document.body);
    const Scroll_Animations = document.querySelectorAll(".Scroll_Animation");
    const Cookie_Banner = document.getElementById("Cookie_Banner");
    const Cookie_Banner_Close = document.getElementById("Cookie_Banner_Close");
    const Appear_On_Scroll_Options = {
        threshold: 0.8,
        rootMargin: "0px 0px 25px 0px"
    };
    const Appear_On_Scoll = new IntersectionObserver(function (Entries, Appear_On_Scoll) {
        Entries.forEach(Entry => {
            if (!Entry.isIntersecting) {
                return;
            } else {
                Entry.target.classList.add("Appear");
                Appear_On_Scoll.unobserve(Entry.target);
            }
        });
    }, Appear_On_Scroll_Options);

    function Update_Scroll_Data(Data) {
        if (Data >= 315 || document.body.getAttribute("data-navbar_appear") === "true") {
            Navbar.classList.add("Appear");
            Latest_Announcement.classList.add("Appear");
        } else {
            Navbar.classList.remove("Appear");
            Latest_Announcement.classList.remove("Appear");
        }
    }

    if (Get_Cookie("Accepted_Cookie_Banner") != "1") {
        document.cookie = "Accepted_Cookie_Banner=0; expires=Thu, 18 Dec 5000 12:00:00 UTC; Secure";
        Cookie_Banner.style["display"] = "block";
    }

    Scroll_Animations.forEach(Object => {
        Appear_On_Scoll.observe(Object);
    });

    Simplebar.getScrollElement().addEventListener("scroll", function (Data) {
        Update_Scroll_Data(Data.srcElement.scrollTop);
    }, {
        passive: true
    });

    if (Cookie_Banner_Close) {
        Cookie_Banner_Close.onclick = function () {
            document.cookie = "Accepted_Cookie_Banner=1; expires=Thu, 18 Dec 5000 12:00:00 UTC; Secure";
            Cookie_Banner.style["bottom"] = "-100px";
            Cookie_Banner.style["opacity"] = "0";

            setTimeout(function () {
                Cookie_Banner.style["display"] = "none";
            }, 400);
        };
    }

    Update_Scroll_Data(0);
})();