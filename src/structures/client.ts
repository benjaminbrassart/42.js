import querystring from "node:querystring";
import axios, { AxiosError, AxiosResponse } from "axios";
import Bottleneck from "bottleneck";
import { UsersManager } from "@/managers/UsersManager";
import { CampusManager } from "@/managers/CampusManager";
import { EventsManager } from "@/managers/EventsManager";
import { Loader } from "@/utils/loader";
import { EventsUsersManager } from "@/managers/EventsUsersManager";
import { CursusManager } from "@/managers/CursusManager";
import { ProjectManager } from "@/managers/ProjectManager";
import { ScaleTeamsManager } from "@/managers/ScaleTeamsManager";

const limiter = new Bottleneck({
	maxConcurrent: 2,
	minTime: 500,
});

interface TokenResponse
{
	access_token: string;
}

export class Client {
	private static readonly TOKEN_URI: string = "https://api.intra.42.fr/oauth/token";
	private static readonly BASE_URL: string = "https://api.intra.42.fr/v2/";
	//
	private readonly _id: string;
	private readonly _secret: string;
	private _token: null | string = null;
	//
	public readonly users = new UsersManager(this);
	public readonly campus = new CampusManager(this);
	public readonly events = new EventsManager(this);
	public readonly events_users = new EventsUsersManager(this);
	public readonly cursus = new CursusManager(this);
	public readonly projects = new ProjectManager(this);
	public readonly scale_teams = new ScaleTeamsManager(this);

	constructor(id: string, secret: string) {
		this._id = id;
		this._secret = secret;
	}

	private async _getToken(): Promise<string> {
		const reqOptions = {
			headers: {
				Accept: "*/*",
				"Content-Type": "application/x-www-form-urlencoded",
			}
		};
		const body: string = querystring.stringify({
			grant_type: "client_credentials",
			client_id: this._id,
			client_secret: this._secret,
		});

		return (
			await axios.post<TokenResponse>(Client.TOKEN_URI, body, reqOptions)
		).data.access_token;
	}

	async get<Req = any, Res = any>(path: string): Promise<AxiosResponse<Req, Res>> {
		if (this._token === null) {
			this._token = await this._getToken();
		}
		// for (let stop = 2; stop !== 0; stop--) {
		const config = {
			headers: {
				Authorization: "Bearer " + this._token,
			},
		};
		// TODO remove limiter.schedule
		return await limiter.schedule(() =>
			axios.get(Client.BASE_URL + path, config)
		);
		// }
	}

	async fetch(path: string, limit: number = 0): Promise<Object[]> {
		const pages: Object[] | null = [];
		let page: Object[] = [];
		let res: AxiosResponse<any, any> | null;
		const bar: Loader = new Loader(24);
		const size: number = limit < 100 && limit > 0 ? limit : 100;
		bar.start();
		try {
			for (let i = 1; page?.length || i === 1; i++) {
				pages.push(...page);
				res = await this.get(path + `&page[size]=${size}&page[number]=` + i);
				if (res === null) throw "Error in Client.fetch";
				page = res.data;
				const total: number = limit || Number(res.headers["x-total"]);
				bar.step(`Fetching pages`, pages.length, total);
				if (limit && pages.length >= limit) {
					bar.end();
					return pages.slice(0, limit);
				}
			}
		} catch (err) {
			console.error(err);
		}
		bar.end();
		return pages;
	}
}
