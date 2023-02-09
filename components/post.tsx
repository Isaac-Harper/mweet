// post.tsx
//

import styles from "../styles/post.module.sass";
import Image from "next/image";
import Link from "next/link";

export default function Post({
	name,
	tag,
	date,
	content,
	picture,
}: {
	name: string;
	tag: string;
	date: string;
	content: string;
	picture: string;
}) {
	// splits up the string that the date is stored as and returns
	// it as a proper date
	function parseISOString(s: string) {
		let b = s.split(/\D+/).map(Number);
		return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
	}
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const properDate = parseISOString(date);
	const day = properDate.getDate();
	const month = properDate.getMonth();
	const shortMonth = months[month];
	const year = properDate.getFullYear();
	const formatted = ` ${day} ${shortMonth}, ${year}`;

	return (
		<>
			<div className={styles.container}>
				<Link href={"/users/" + tag} className={styles.edge}>
					<Image
						src={picture}
						width={50}
						height={50}
						alt="profile"
						className={styles.icon}
					/>
				</Link>
				<div className={styles.headline}>
					<p className={styles.black}>
						<b>{name}</b>
					</p>
					<Link href={"/users/" + tag} className={styles.tag}>
						@{tag}
					</Link>
					<div className={styles.dot}>•</div>
					<p>{formatted}</p>
				</div>
				<div className={styles.content}>
					<p>{content}</p>
				</div>
			</div>
		</>
	);
}
