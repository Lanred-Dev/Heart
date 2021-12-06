module.exports = {
	name: "Get_Member_Roles",

	execute(Member, Guild, Max_Amount) {
		let String = "";
		let Role_Amount = 0;
		let Extra_Roles = 0;

		Member.roles.cache.forEach((Role) => {
			if (Role_Amount > Max_Amount) {
				Extra_Roles++;
			} else if (Role.id != Guild.roles.everyone.id) {
				String = `${Role_Amount === 0 ? Role.toString() : `${String}, ${Role.toString()}`}`;
				Role_Amount++;
			}
		});

		return Role_Amount > 0 && Extra_Roles > 0 ? `${String}, +${Extra_Roles} more` : Role_Amount === 0 ? "0 roles" : String;
	},
};
