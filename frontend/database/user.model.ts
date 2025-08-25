import { model, models, Schema, Document } from "mongoose";

export interface IUser {
	name: string;
	age: number;
	sex: string;
	email: string;
	password: string;
	cid: string;
	publicKey: string;
	location: string;
	contactNumber: number;
	role: "admin" | "user";
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		age: { type: Number, required: true },
		sex: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		cid: { type: String, required: true },
		publicKey: { type: String, required: true },
		location: { type: String, required: true },
		contactNumber: { type: Number, required: true },
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
