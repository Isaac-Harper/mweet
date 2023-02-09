// followList.tsx
//

import styles from "../styles/followList.module.sass";
import FollowTag from "../components/followTag";
import { Mweeter } from "../interfaces";
import { useState } from "react";

export default function FollowList({
	mweeters,
	onClickFunction,
	buttonText,
	title,
}: {
	mweeters: Mweeter[];
	onClickFunction: any;
	buttonText: string;
	title: string;
}) {
	const [shown, setShown] = useState(true);

	let toggleText;
	if (shown) {
		toggleText = (
			<>
				{mweeters.length > 0 ? (
					mweeters.map((mweeter) => (
						<FollowTag
							key={mweeter.id}
							mweeter={mweeter}
							onClickFunction={onClickFunction}
							buttonText={buttonText}
						/>
					))
				) : (
					<p>no new users</p>
				)}
			</>
		);
	} else {
		toggleText = <div className={styles.border}></div>;
	}
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3>{title}</h3>
				<button className={styles.toggle} onClick={() => setShown(!shown)}>
					▲
				</button>
			</div>
			{toggleText}
		</div>
	);
}
