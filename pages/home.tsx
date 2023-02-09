import React, { useEffect, useState } from "react";
import Dashboard from "../components/dashboard";
import PostFeed from "../components/postFeed";
import NewPost from "../components/newPost";
import styles from "../styles/Home.module.sass";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "../utils/supabase";
import { GetServerSideProps } from "next";
import { Mweet, Mweeter } from "../interfaces";
import FollowList from "../components/followList";

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

		// set current mweeter
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
			props: { user, typedMweet, typedMweeter, mweeterData },
		};
	},
});

export default function Home({
	user,
	typedMweet,
	typedMweeter,
	mweeterData,
}: {
	user: any;
	typedMweet: Mweet[];
	typedMweeter: Mweeter[];
	mweeterData: any;
}) {
	const supabase = getSupabase(user.accessToken);
	const [content, setContent] = useState(""); // new mweet content
	const [allMweets, setMweets] = useState(typedMweet);
	const [allMweeters, setAllMweeters] = useState(typedMweeter);
	const [mweeter, setMweeter] = useState(mweeterData); // logged in mweeter

	// not logged in mweeters
	const [mweetersList, setMweetersList] = useState(
		allMweeters.filter((obj) => {
			return obj.user_id !== user.sub;
		})
	);

	// unfollowed mweeters
	const [unfollowedMweeters, setUnfollowedMweeters] = useState(
		mweetersList.filter((obj) => {
			return !mweeter.following.includes(obj.user_id);
		})
	);

	// mweets user follows
	const [followedMweets, setFollowedMweets] = useState(
		allMweets.filter((obj) => {
			return mweeter.following.includes(obj.user_id);
		})
	);

	// users own mweets
	const [mweeterMweets, setMweeterMweets] = useState(
		allMweets.filter((obj) => {
			return obj.user_id === mweeter.user_id;
		})
	);

	// combination of followed and own mweets
	const [homeMweets, setHomeMweets] = useState([
		...followedMweets,
		...mweeterMweets,
	]);

	// update all the filtered lists
	async function setLists() {
		setUnfollowedMweeters(
			mweetersList.filter((obj) => {
				return !mweeter.following.includes(obj.user_id);
			})
		);
		setFollowedMweets(
			allMweets.filter((obj) => {
				return mweeter.following.includes(obj.user_id);
			})
		);
		setMweeterMweets(
			allMweets.filter((obj) => {
				return obj.user_id === mweeter.user_id;
			})
		);
		setHomeMweets([...followedMweets, ...mweeterMweets]);
	}

	// get all the mweets
	const fetchMweets = async () => {
		const { data, error } = await supabase.from("mweets_view").select("*");
		if (error) console.log(error.message);

		let mweets: Mweet[];
		if (data) {
			mweets = data;
		} else {
			mweets = [];
		}

		setLists();

		setMweets(mweets);
		return data;
	};

	// make a new mweet
	async function handleSubmit(event: { preventDefault: () => void }) {
		event.preventDefault();
		const { error } = await supabase
			.from("mweets")
			.insert({ user_id: user.sub, content: content })
			.select();
		if (error) console.log(error.message);
		fetchMweets();
		setContent("");
		await setLists();
	}

	async function followUser(user_id: string) {
		let temp = mweeter;
		temp.following = [...mweeter.following, user_id];
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

	// update feed when lists user makes a new mweet
	useEffect(() => {
		setHomeMweets([...followedMweets, ...mweeterMweets]);
	}, [mweeterMweets]);

	return (
		<div>
			<Dashboard userMweeter={mweeter}>
				<div className={styles.outer}>
					<h2 className={styles.heading}>Your Feed</h2>
					<div className={styles.container}>
						<NewPost
							handleSubmit={handleSubmit}
							content={content}
							setContent={setContent}
							mweeter={mweeter}
						/>

						<PostFeed allMweets={homeMweets} />

						<FollowList
							mweeters={unfollowedMweeters}
							onClickFunction={followUser}
							buttonText="follow"
							title="Follow Others"
						/>
					</div>
				</div>
			</Dashboard>
		</div>
	);
}
