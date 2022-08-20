import "dotenv/config";
import { Client, User } from "@/index";
import assert from "assert";

describe("User", () => {
	let client: Client;

	before(() => {
		client = new Client(<string>process.env.CLIENT_ID, <string>process.env.CLIENT_SECRET);
	})

	describe("valid user", () => {
		let user: User | null;

		before(async () => {
			user = await client.users.get("norminet");
		});
		it("should not be null", () => {
			assert.notEqual(user, null);
		});
		it("should have 'norminet' as login", async () => {
			assert.equal("norminet", user?.login);
		});
	});
	describe("invalid user", () => {
		let user: User | null;

		before(async () => {
			user = await client.users.get("0000000000000000000000");
		});
		it("should be null", () => {
			assert.equal(user, null);
		});
	});
});


// (async () => {
// 	const client = new Client(<string>process.env.CLIENT_ID, <string>process.env.CLIENT_SECRET);

// 	const user = await client.users.get("shocquen");
// 	const events = await user?.fetchEvents();
// 	console.log(user?.displayname);
// 	const scale_teams = await user?.fetchScale_teams({ limit: 5 });
// 	console.log(scale_teams);
// 	const projects_users = await user?.fetchProjects();
// 	console.log(projects_users);
// })();
