import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import styles from "../styles/Base.module.sass";
import Link from "next/link";

export default function Home() {
	const { user } = useUser();

	// user exists when a user is authenticated

	if (user) {
		return (
			<div className={styles.container}>
				<h1 className={styles.title}>mweeter</h1>
				<a className={styles.logoutButton} href="/api/auth/logout">
					Logout
				</a>
				<Link className={styles.homeButton} href="home">
					Open Feed
				</Link>
			</div>
		);
	}
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>mweeter</h1>
			<a className={styles.button} href="/api/auth/login">
				Login and Signup with Auth0
			</a>
		</div>
	);
}
