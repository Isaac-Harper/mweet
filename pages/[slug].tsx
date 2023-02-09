// [...slug].tsx
//

import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Dashboard from "../components/dashboard";
import { Mweeter } from "../interfaces";
import { getSupabase } from "../utils/supabase";
import styles from "../styles/Settings.module.sass";

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res }: any) {
		const { user }: any = await getSession(req, res);
		const supabase = getSupabase(user.accessToken);

		let ownProfile = false;

		const { data: currentMweeterData } = await supabase
			.from("mweeters")
			.select("*")
			.eq("user_id", user.sub)
			.single();
		let currentMweeter: Mweeter;
		let mweeterOut: Mweeter = {
			id: 0,
			created_at: "",
			user_id: "",
			name: "",
			tag: "",
			following: [],
			picture: "",
		};

		console.log(currentMweeterData);
		if (currentMweeterData) {
			currentMweeter = currentMweeterData;
			if (currentMweeter.user_id === user.sub) {
				mweeterOut = currentMweeter;
				ownProfile = true;
			}
		}

		return {
			props: { ownProfile, mweeterOut },
		};
	},
});

export default function User({
	user,
	ownProfile,
	mweeterOut,
}: {
	user: any;
	ownProfile: boolean;
	mweeterOut: Mweeter;
}) {
	const router = useRouter();
	const supabase = getSupabase(user.accessToken);
	const slug = router.query.slug || [];
	const [name, setName] = useState(mweeterOut.name);
	const [tag, setTag] = useState(mweeterOut.tag);
	const [mweeter, setMweeter] = useState(mweeterOut);

	const handleFormSubmit = async (event: any) => {
		event.preventDefault();
		const { data, error } = await supabase
			.from("mweeters")
			.update({ name: name, tag: tag })
			.eq("user_id", user.sub)
			.select("*")
			.single();
		if (error) console.log(error.message);
		if (data) {
			const mweeterData: Mweeter = data;
			setMweeter(mweeterData);
		}
	};

	if (slug !== "settings") {
		return <p>Page Not Found</p>;
	}

	if (ownProfile) {
		return (
			<Dashboard userMweeter={mweeter}>
				<div className={styles.outer}>
					<h2>Update User </h2>
					<form onSubmit={handleFormSubmit} className={styles.container}>
						<div className={styles.row}>
							<label htmlFor="name">name</label>
							<input
								type="text"
								id="name"
								placeholder={mweeter.name}
								onChange={(input) => setName(input.target.value)}
								value={name}
							/>
						</div>
						<div className={styles.row}>
							<label htmlFor="tag">tag</label>
							<input
								type="text"
								id="tag"
								placeholder={mweeter.tag}
								onChange={(input) => setTag(input.target.value)}
								value={tag}
							/>
						</div>
						<button>update</button>
					</form>
				</div>
			</Dashboard>
		);
	} else {
		return <>cannot edit this user</>;
	}
}
