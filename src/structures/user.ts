import { BaseManager } from "@/managers/BaseManager";
import { Client } from "@/structures/client";
import { ICursusUsers } from "@/structures/cursus_users";
import { IScaleTeam, ScaleTeam } from "@/structures/scale_teams";

export interface IUser {
	id: number;
	email: string;
	login: string;
	first_name: string;
	last_name: string;
	usual_full_name: string;
	usual_first_name?: string;
	url: string;
	displayname: string;
	image_url: string;
	new_image_url: string;
	"staff?": boolean;
	correction_point: number;
	pool_month: string;
	pool_year: string;
	location: string | null;
	wallet: number;
	anonymize_date: Date;
	data_erasure_date: Date;
	created_at: Date;
	updated_at: Date;
	alumnized_at: Date | null;
	"alumni?": boolean;
	groups: object[];
	cursus_users: ICursusUsers[];
	projects_users: object[];
	languages_users: object[];
	achievements: object[];
	titles: object[];
	titles_users: object[];
	partnerships: object[];
	patroned: object[];
	patroning: object[];
	expertises_users: object[];
	roles: object[];
	campus: object[];
	campus_users: object[];
}

export class User extends BaseManager implements IUser {

	private readonly iface: IUser;

	get id() { return this.iface.id; }
	get email() { return this.iface.email; }
	get login() { return this.iface.login; }
	get first_name() { return this.iface.first_name; }
	get last_name() { return this.iface.last_name; }
	get usual_full_name() { return this.iface.usual_full_name; }
	get usual_first_name() { return this.iface.usual_first_name; }
	get url() { return this.iface.url; }
	get displayname() { return this.iface.displayname; }
	get image_url() { return this.iface.image_url; }
	get new_image_url() { return this.iface.new_image_url; }
	get correction_point() { return this.iface.correction_point; }
	get pool_month() { return this.iface.pool_month; }
	get pool_year() { return this.iface.pool_year; }
	get location() { return this.iface.location; }
	get wallet() { return this.iface.wallet; }
	get anonymize_date() { return this.iface.anonymize_date; }
	get data_erasure_date() { return this.iface.data_erasure_date; }
	get created_at() { return this.iface.created_at; }
	get updated_at() { return this.iface.updated_at; }
	get alumnized_at() { return this.iface.alumnized_at; }
	get groups() { return this.iface.groups; }
	get cursus_users() { return this.iface.cursus_users; }
	get projects_users() { return this.iface.projects_users; }
	get languages_users() { return this.iface.languages_users; }
	get achievements() { return this.iface.achievements; }
	get titles() { return this.iface.titles; }
	get titles_users() { return this.iface.titles_users; }
	get partnerships() { return this.iface.partnerships; }
	get patroned() { return this.iface.patroned; }
	get patroning() { return this.iface.patroning; }
	get roles() { return this.iface.roles; }
	get expertises_users() { return this.iface.expertises_users; }
	get campus() { return this.iface.campus; }
	get campus_users() { return this.iface.campus_users; }

	readonly "staff?": boolean;
	readonly "alumni?": boolean;

	constructor(client: Client, data: IUser) {
		super(client);
		this.iface = data;
		this["staff?"] = data["staff?"];
		this["alumni?"] = data["alumni?"];
	}

	async fetchEvents(): Promise<void | object[]> {
		const ret = this.client
			.fetch("users/" + this.id + "/events?")
			.catch(console.error);
		return ret;
	}

	async fetchProjects(): Promise<void | object[]> {
		const ret = this.client
			.fetch("users/" + this.id + "/projects_users?")
			.catch(console.error);
		return ret;
	}

	/**
	 * Look for an array of scale teams that the user is in
	 * @param  {{limit?:number;params:string[]}} options basic fetch options
	 * @param  {number} type 0 for all, 1 for "as corrector", 2 for "as corrected"
	 * @returns Promise
	 */
	async fetchScale_teams(
		options?: {
			limit?: number;
			params?: string[];
		},
		type: number = 0
	): Promise<ScaleTeam[]> {
		let url = "/users/" + this.id + "/scale_teams";
		if (type === 1) url += "/as_corrector";
		if (type === 2) url += "/as_corrected";
		url += "?" + options?.params?.join("&");
		const res = await this.client.fetch(url, options?.limit);
		return res.map((o) => new ScaleTeam(<IScaleTeam>o));
	}
}
