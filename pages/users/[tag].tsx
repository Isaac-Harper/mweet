// [tag].tsx
//

import Head from "next/head";
import React, { useState } from "react";
import Image from "next/image";

import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "../../utils/supabase";
import styles from "../../styles/Profile.module.sass";
import Dashboard from "../../components/dashboard";
import PostFeed from "../../components/postFeed";
import { GetServerSideProps } from "next";
import { Mweet, Mweeter } from "../../interfaces";

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res, params }: any) {
		const { user }: any = await getSession(req, res);
		const supabase = getSupabase(user.accessToken);

		const { data: currentMweeterData } = await supabase
			.from("mweeters")
			.select("*")
			.eq("tag", params.tag)
			.single();
		let currentMweeter: Mweeter;
		currentMweeterData
			? (currentMweeter = currentMweeterData)
			: (currentMweeter = {
					id: 0,
					created_at: "",
					user_id: "",
					name: "",
					tag: "",
					following: [],
					picture: "",
			  });

		const { data: myMweeterData } = await supabase
			.from("mweeters")
			.select("*")
			.eq("user_id", user.sub)
			.single();
		let myMweeter: Mweeter;
		myMweeterData
			? (myMweeter = myMweeterData)
			: (myMweeter = {
					id: 0,
					created_at: "",
					user_id: "",
					name: "",
					tag: "",
					following: [],
					picture: "",
			  });

		const { data: mweetsData } = await supabase
			.from("mweets_view")
			.select("*")
			.eq("tag", params.tag);
		let mweets: Mweet[];
		mweetsData ? (mweets = mweetsData) : (mweets = []);

		let ownProfile = false;
		if (currentMweeter.user_id === myMweeter.user_id) {
			ownProfile = true;
		}

		return {
			props: { ownProfile, myMweeter, currentMweeter, mweetsData },
		};
	},
});

export default function User({
	user,
	ownProfile,
	myMweeter,
	currentMweeter,
	mweetsData,
}: {
	user: any;
	ownProfile: boolean;
	myMweeter: Mweeter;
	currentMweeter: Mweeter;
	mweetsData: Mweet[];
}) {
	const [mweeter, setMweeter] = useState(myMweeter);
	const [followText, setFollowText] = useState(
		mweeter.following.includes(currentMweeter.user_id) ? "unfollow" : "follow"
	);
	const supabase = getSupabase(user.accessToken);

	async function handleClick() {
		let temp = mweeter;
		if (mweeter.following.includes(currentMweeter.user_id)) {
			temp.following = temp.following.filter(
				(obj) => obj !== currentMweeter.user_id
			);
			setFollowText("follow");
		} else {
			temp.following = [...mweeter.following, currentMweeter.user_id];
			setFollowText("unfollow");
		}

		const { data, error } = await supabase
			.from("mweeters")
			.update({ following: temp.following })
			.eq("user_id", user.sub)
			.select("*");
		if (error) console.log(error.message);
		if (data) {
			let mweeterOut: Mweeter;
			mweeterOut = data[0];
			setMweeter(mweeterOut);
		}
	}

	let button = <></>;
	if (!ownProfile) {
		button = (
			<button className={styles.followButton} onClick={handleClick}>
				{followText}
			</button>
		);
	}

	return (
		<>
			<Head>
	      	  	<title>User</title>
		        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      			<meta name='description' content='Mweeter User'/>
	      	</Head>
			<Dashboard userMweeter={mweeter}>
				<div className={styles.container}>
					<div className={styles.head}>
						<Image
							className={styles.picture}
							src={currentMweeter.picture}
							width={100}
							height={100}
							alt="profile"
						/>
						<h2>{currentMweeter.name}</h2>
						<p>@{currentMweeter.tag}</p>
						{button}
					</div>
					<div className={styles.inner}>
						<PostFeed allMweets={mweetsData} />
					</div>{" "}
				</div>
			</Dashboard>
		</>
	);
}
