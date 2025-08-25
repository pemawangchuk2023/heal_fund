import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
	interface User extends NextAuthUser {
		role: "user" | "admin";
	}

	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			role: "user" | "admin";
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		email: string;
		name: string;
		role: "user" | "admin";
	}
}
