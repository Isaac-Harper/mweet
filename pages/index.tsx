// index.tsx

import Head from "next/head";

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
				<Head>
					<title>Landing</title>
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>
					<meta name="description" content="Mweeter Landing" />
				</Head>
				<div className={styles.titleOuter}>
					<h1 className={styles.title}>mweeter</h1>
					<p>by Isaac Harper</p>
				</div>
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
			<Head>
				<title>Landing</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta name="description" content="Mweeter Landing" />
			</Head>
			<div className={styles.titleOuter}>
				<h1 className={styles.title}>mweeter</h1>
				<p>by Isaac Harper</p>
			</div>
			<a className={styles.button} href="/api/auth/login">
				Login and Signup with Auth0
			</a>
		</div>
	);
}
