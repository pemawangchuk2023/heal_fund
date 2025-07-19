import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignInSchema } from "@/lib/validation";
import { signInWithCredentials } from "@/lib/actions/user.action";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const validated = SignInSchema.safeParse(credentials);
				if (!validated.success) {
					throw new Error("Invalid credentials");
				}

				const { email, password } = validated.data;
				const result = await signInWithCredentials({ email, password });

				if (!result.success || !result.data) {
					throw new Error("Authentication failed");
				}

				return {
					id: result.data.email,
					email: result.data.email,
					name: result.data.name,
				};
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.email = user.email;
				token.name = user.name;
			}
			return token;
		},
		async session({ session, token }) {
			if (token.email) {
				session.user.email = token.email;
				session.user.name = token.name;
			}
			return session;
		},
	},
});
