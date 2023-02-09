// newPost.tsx
//

import styles from "../styles/newPost.module.sass";
import Image from "next/image";
import { Mweeter } from "../interfaces";

export default function newPost({
	handleSubmit,
	content,
	setContent,
	mweeter,
}: {
	handleSubmit: any;
	content: string;
	setContent: any;
	mweeter: Mweeter;
}) {
	return (
		<div className={styles.outer}>
			<form onSubmit={handleSubmit} className={styles.container}>
				<div className={styles.edge}>
					<Image
						src={mweeter.picture}
						width={50}
						height={50}
						alt="profile"
						className={styles.icon}
					/>
				</div>

				<textarea
					onChange={(e) => setContent(e.target.value)}
					placeholder="What's on your mind..."
					className={styles.input}
					maxLength={280}
					value={content}
				/>
				<div className={styles.subline}>
					<button className={styles.button}>Send mweet</button>
				</div>
			</form>
		</div>
	);
}
