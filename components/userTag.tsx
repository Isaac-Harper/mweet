// userTag.tsx
//

import styles from "../styles/userTag.module.sass";
import Image from "next/image";
import { Mweeter } from "../interfaces";
import Link from "next/link";

export default function UserTag({ userMweeter }: { userMweeter: Mweeter }) {
	return (
		<>
			<Link href={"/settings"} className={styles.container}>
				<div className={styles.edge}>
					<Image
						width={50}
						height={50}
						src={userMweeter.picture}
						alt="profile"
						className={styles.icon}
					/>
				</div>
				<div className={styles.info}>
					<p className={styles.black}>
						<b>{userMweeter.name}</b>
					</p>
					<p>@{userMweeter.tag}</p>
				</div>
			</Link>
		</>
	);
}
