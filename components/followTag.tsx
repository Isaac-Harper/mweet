import styles from "../styles/followTag.module.sass";
import { Mweeter } from "../interfaces";
import Link from "next/link";
import Image from "next/image";

export default function FollowTag({
	mweeter,
	onClickFunction,
	buttonText,
}: {
	mweeter: Mweeter;
	onClickFunction: any;
	buttonText: string;
}) {
	return (
		<div className={styles.tag}>
			<Link href={"/users/" + mweeter.tag} className={styles.container}>
				<div className={styles.edge}>
					<Image
						width={50}
						height={50}
						src={mweeter.picture}
						alt="profile"
						className={styles.icon}
					/>
				</div>
				<div className={styles.info}>
					<p className={styles.black}>
						<b>{mweeter.name}</b>
					</p>
					<p>@{mweeter.tag}</p>
				</div>
			</Link>
			<button
				onClick={() => onClickFunction(mweeter.user_id)}
				className={styles.button}
			>
				{buttonText}
			</button>
		</div>
	);
}
