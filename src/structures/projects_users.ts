import { IProject } from "@/structures/project";
import { ITeam } from "@/structures/teams";

export interface IProjectsUsers {
    id: number,
    occurence: number,
    final_mark: number | null,
    status: string,
    project: IProject,
    cursus_ids: number[],
    teams: ITeam[]
}
