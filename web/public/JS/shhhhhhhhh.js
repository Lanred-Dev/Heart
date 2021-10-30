//hey! keep this one a secret.

(function () {
    const Modal = document.getElementById("Spacebar_Modal");
    const Modal_Content = document.getElementById("Super_Secret_Hidden_Spacebar_Game_Modal_Content");
    const Start_Button = document.getElementById("Super_Secret_Hidden_Spacebar_Game_Start_Button");
    const Spacebar_Key_Visual = document.getElementById("Super_Secret_Hidden_Spacebar_Game_Spacebar_Key");
    const Game_Timer = document.getElementById("Super_Secret_Hidden_Spacebar_Game_Game_Timer");
    const Score_Counter = document.getElementById("Super_Secret_Hidden_Space_Bar_Game_Score");
    const Game = document.getElementById("Super_Secret_Hidden_Spacebar_Game");
    const Menu = document.getElementById("Super_Secret_Hidden_Spacebar_Game_Menu");
    const Start_Timer = document.getElementById("Super_Secret_Hidden_Spacebar_Game_Start_Timer");
    const Start_Timer_Container = document.getElementById("Super_Secret_Hidden_Spacebar_Game_Timer_Container");
    const Game_Container = document.getElementById("Super_Secret_Hidden_Spacebar_Game_Main_Game_Container");
    const High_Score_Label = document.getElementById("Super_Secret_Hidden_Spacebar_Game_High_Score");
    const Last_Game_Score_Label = document.getElementById("Super_Secret_Hidden_Spacebar_Game_Last_Game_Score");
    let Current = {
        Game_Started: false,
        Score: 0,
        Time: 0,
        Start_Time: 0,
        In_Game: false,
        Spacebar_Down: false,
        High_Score: 0,
    }

    function Update() {
        setTimeout(function () {
            if (Current.Time <= 0) {
                Current.Score > Current.High_Score ? Current.High_Score = Current.Score : null;

                Current.In_Game = false;
                Current.Game_Started = false;
                Last_Game_Score_Label.innerText = Current.Score;
                High_Score_Label.innerHTML = Current.High_Score;
                Game.style["display"] = "none";
                Menu.style["display"] = "block";
                Start_Button.innerText = "Play Again";
            } else {
                Current.Time -= 1;
                Game_Timer.innerText = `${Current.Time} seconds remaining`;

                Update();
            }
        }, 1000);
    }

    function Update_Start_Timer() {
        setTimeout(function () {
            if (Current.Start_Time <= 0) {
                Current.In_Game = true;
                Start_Timer_Container.style["display"] = "none";
                Game_Container.style["display"] = "block";

                Update();
            } else {
                Current.Start_Time -= 1;
                Start_Timer.innerText = Current.Start_Time;

                Update_Start_Timer();
            }
        }, 1000);
    }

    function Start_Game() {
        Current.Game_Started = true;
        Current.Time = 10;
        Current.Start_Time = 5;
        Game_Timer.innerText = `${Current.Time} seconds remaining`;
        Start_Timer.innerText = Current.Start_Time;
        Current.Score = 0;
        Score_Counter.innerText = Current.Score;
        Game.style["display"] = "block";
        Menu.style["display"] = "none";
        Current.Spacebar_Down = false;
        Start_Timer_Container.style["display"] = "block";
        Game_Container.style["display"] = "none";

        Update_Start_Timer();
    }

    window.addEventListener("keydown", function (Event) {
        if (Event.defaultPrevented) {
            return;
        }

        if (Event.key === "Escape" && Modal.style["display"] != "flex") {
            console.log("well darn, you found it.");

            Modal.style["display"] = "flex";

            setTimeout(function () {
                Modal.classList.add("Active");
            }, 10);
        } else if (Event.key === " " && Current.In_Game === true && Current.Spacebar_Down != true) {
            Current.Score++;
            Current.Spacebar_Down = true;
            Score_Counter.innerText = Current.Score;

            Spacebar_Key_Visual.classList.add("Active");
        }

        Event.preventDefault();
    }, true);

    window.addEventListener("keyup", function (Event) {
        if (Event.defaultPrevented) {
            return;
        }

        if (Event.key === " " && (Current.In_Game === true || Spacebar_Key_Visual.classList["Active"] != null)) {
            Current.Spacebar_Down = false;

            Spacebar_Key_Visual.classList.remove("Active");
        }

        Event.preventDefault();
    }, true);

    window.onclick = function (Event) {
        if (Event.target === Modal && Current.Game_Started != true) {
            Modal.classList.remove("Active");
            Modal_Content.style["transition"] = "transform 0.4s, opacity 0.4s";
            Modal_Content.style["transform"] = "scale(0.8)";
            Modal_Content.style["opacity"] = "0";

            setTimeout(function () {
                Modal_Content.style["transition"] = "none";
                Modal_Content.style["transform"] = "scale(1)";
                Modal_Content.style["opacity"] = "1";
                Modal_Content.style["display"] = "none";
            }, 400);

            setTimeout(function () {
                Modal.style["display"] = "none";
                Modal_Content.style["display"] = "block";
            }, 800);
        }
    };

    Start_Button.onclick = function () {
        if (Modal.style["display"] != "flex" && Current.Game_Started != true) return;

        Start_Game();
    };
})();