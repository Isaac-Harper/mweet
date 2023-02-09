import auth0 from "../../../lib/auth0";

export default async function login(req, res) {

  let options = {
    returnTo: 'http://localhost:3000/dashboard'
  }

  try {
    await auth0.handleLogin(req, res, options);

  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}