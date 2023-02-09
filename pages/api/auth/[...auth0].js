import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import jwt from "jsonwebtoken";

const afterCallback = async (req, res, session) => {
	const payload = {
		userId: session.user.sub,
		returnTo: "/home"
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
			res.status(error.status || 500).end(error.message);
		}
	},
});
