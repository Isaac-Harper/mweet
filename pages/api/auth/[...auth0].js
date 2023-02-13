import { handleAuth, handleCallback, handleLogin } from "@auth0/nextjs-auth0";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";

const afterCallback = async (req, res, session) => {
	const payload = {
		userId: session.user.sub,
	};

	const token = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET);
	session.user.accessToken = token;

	return session;
};

export default handleAuth({
	async callback(req, res) {
		try {
			await handleCallback(req, res, { afterCallback });
		} catch (error) {
			console.log(error.message);
			res.status(error.status || 500).end(error.message);
		}
	},

	async login(req, res) {
		try {
			await handleLogin(req, res, {
				returnTo: "/home",
			});
		} catch (error) {
			console.log(error.message);
			res.status(error.status || 500).end(error.message);
		}
	},
});
