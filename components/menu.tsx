// menu.tsx
//

import styles from "../styles/menu.module.sass";
import UserTag from "../components/userTag";
import houseImage from "../public/home-3-svgrepo-com.svg";
import followImage from "../public/thumb-up-svgrepo-com(1).svg";
import profileImage from "../public/emoji-very-happy-svgrepo-com.svg";
import outImage from "../public/log-out-1-svgrepo-com.svg";
import Link from "next/link";
import { Mweeter } from "../interfaces";
import MenuButton from "./menuButton";

export default function Post({ userMweeter }: { userMweeter: Mweeter }) {
	return (
		<div className={styles.container}>
			<h1>
				<Link className={styles.header} href="/">
					<p className={styles.bigHeader}>mweeter</p>
					<p className={styles.smallHeader}>m</p>
				</Link>
			</h1>
			<MenuButton href="/home" src={houseImage} alt="house" text="Home" />
			<MenuButton
				href="/following"
				src={followImage}
				alt="following"
				text="Following"
			/>
			<MenuButton
				href={"/users/" + userMweeter.tag}
				src={profileImage}
				alt="profile"
				text="Your Profile"
			/>
			<MenuButton
				href="/api/auth/logout"
				src={outImage}
				alt="logout"
				text="Log out"
			/>

			<hr className={styles.line} />

			<div className={styles.tagWrap}>
				<UserTag userMweeter={userMweeter} />
			</div>
		</div>
	);
}
