import { IFeedbackDetails } from "@/structures/feedback_details";
import { IUser } from "@/structures/user";

export interface IFeedback {
    id: number,
    user: IUser,
    feedbackable_type: string,
    feedbackable_id: number,
    comment: string,
    rating: number,
    created_at: Date,
    feedback_details: IFeedbackDetails[]
}
