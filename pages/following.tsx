import styles from "../styles/Following.module.sass";
import React, { useEffect, useState } from "react";
import Dashboard from "../components/dashboard";
import PostFeed from "../components/postFeed";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "../utils/supabase";
import FollowList from "../components/followList";
import { GetServerSideProps } from "next";
import { Mweet, Mweeter } from "../interfaces";

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res }) {
		const { user }: any = await getSession(req, res);
		const supabase = getSupabase(user.accessToken);

		// get all the mweets
		const { data: allMweetsData } = await supabase
			.from("mweets_view")
			.select("*");
		let typedMweet: Mweet[];
		allMweetsData ? (typedMweet = allMweetsData) : (typedMweet = []);

		// get all the mweeters
		const { data: allMweetersData } = await supabase
			.from("mweeters")
			.select("*");
		let typedMweeter: Mweeter[];
		allMweetersData ? (typedMweeter = allMweetersData) : (typedMweeter = []);

		//set current mweeter
		let mweeterData = typedMweeter.find((obj) => obj.user_id === user.sub);
		if (!mweeterData) {
			const { data } = await supabase
				.from("mweeters")
				.insert({
					user_id: user.sub,
					name: user.name,
					tag: user.nickname,
					picture: user.picture,
					following: [],
				})
				.select();
			if (data) {
				mweeterData = data[0];
			}
		}

		return {
			props: { user, allMweetsData, allMweetersData, mweeterData },
		};
	},
});

export default function Following({
	user,
	allMweetsData,
	allMweetersData,
	mweeterData,
}: {
	user: any;
	allMweetsData: Mweet[];
	allMweetersData: Mweeter[];
	mweeterData: Mweeter;
}) {
	const supabase = getSupabase(user.accessToken);
	const [allMweets, setMweets] = useState(allMweetsData);
	const [allMweeters, setAllMweeters] = useState(allMweetersData);
	const [mweeter, setMweeter] = useState(mweeterData); // logged in mweeter

	// not logged in mweeter
	const [mweetersList, setMweetersList] = useState(
		allMweeters.filter((obj) => {
			return obj.user_id !== user.sub;
		})
	);

	// mweeters user follows
	const [followedMweeters, setFollowedMweeters] = useState(
		mweetersList.filter((obj) => {
			return mweeter.following.includes(obj.tag);
		})
	);

	// mweets user follows
	const [followedMweets, setFollowedMweets] = useState(
		allMweets.filter((obj) => {
			return mweeter.following.includes(obj.tag);
		})
	);

	// update all filtered lists
	async function setLists() {
		setFollowedMweeters(
			allMweeters.filter((obj) => {
				return mweeter.following.includes(obj.tag);
			})
		);

		setFollowedMweets(
			allMweets.filter((obj) => {
				return mweeter.following.includes(obj.tag);
			})
		);
	}

	async function unfollowUser(tag: string) {
		let temp = mweeter;
		temp.following = temp.following.filter((obj) => obj !== tag);
		setMweeter(temp);

		const { error } = await supabase
			.from("mweeters")
			.update({ following: temp.following })
			.eq("user_id", user.sub);
		if (error) console.log(error.message);

		setLists();
	}

	// update lists when new data arrives
	useEffect(() => {
		setLists();
	}, [allMweets, allMweeters]);

	return (
		<Dashboard userMweeter={mweeter}>
			<div className={styles.outer}>
				<h2 className={styles.heading}>Following Feed</h2>
				<div className={styles.container}>
					<PostFeed allMweets={followedMweets} />
					<FollowList
						mweeters={followedMweeters}
						onClickFunction={unfollowUser}
						buttonText="unfollow"
						title="Following List"
					/>
				</div>
			</div>
		</Dashboard>
	);
}
