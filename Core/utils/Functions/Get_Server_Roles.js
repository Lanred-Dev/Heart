module.exports = {
    name: "Get_Server_Roles",

    execute(Guild, Max_Amount) {
        var String = "";
        var Role_Amount = 0;
        var Extra_Roles = 0;
    
        Guild.roles.cache.forEach(Role => {
            if (Role_Amount > Max_Amount) {
                Extra_Roles++;
            } else if (Role.id != Guild.roles.everyone.id) {
                String = `${Role_Amount === 0 ? Role.name : `${String}, ${Role.name}`}`;
                Role_Amount++;
            }
        });
    
        return Role_Amount > 0 && Extra_Roles > 0 ? `${String}, +${Extra_Roles} more` : Role_Amount === 0 ? "0 roles" : String;
    }
};