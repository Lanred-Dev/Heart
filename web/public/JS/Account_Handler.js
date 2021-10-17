(async function () {
    try {
        let Login_Button = document.getElementById("Navbar_Login_Button");
        let Account_Details = document.getElementById("Navbar_Account_Details");
        let Account_Details_Username = document.getElementById("Navbar_Account_Details_Username");
        let Account_Details_Icon = document.getElementById("Navbar_Account_Details_Icon");
        let User_Info = Account_Details.getAttribute("data-user_details") === null ? null : JSON.parse(Account_Details.getAttribute("data-user_details"));

        if (User_Info != null) {
            Account_Details.style["display"] = "flex";
            Login_Button.style["display"] = "none";
            Account_Details_Username.innerText = User_Info.Username;
            Account_Details_Icon.src = User_Info.Icon;
        } else {
            Login_Button.style["display"] = "block";
            Account_Details.style["display"] = "none";
        }

        setTimeout(function () {
            Account_Details.removeAttribute("data-user_details");
        }, 5000);
    } catch (Error) {
        console.log(`Failed to run login handler.\nError: ${Error}`);
    };
})();