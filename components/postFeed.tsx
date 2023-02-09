// postFeed.tsx
//

import styles from "../styles/postFeed.module.sass";
import Post from "../components/post";
import { Mweet } from "../interfaces";

export default function PostFeed({ allMweets }: { allMweets: Mweet[] }) {
	// splits up the string that the date is stored as and returns
	// it as a proper date
	function parseISOString(s: string) {
		let b = s.split(/\D+/).map(Number);
		return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
	}

	// sorts all the mweets by when they were created
	if (allMweets) {
		allMweets.sort(
			(a, b) =>
				parseISOString(b.created_at).getTime() -
				parseISOString(a.created_at).getTime()
		);
	}

	return (
		<div className={styles.container}>
			{allMweets?.length > 0 ? (
				allMweets.map((mweet: Mweet) => (
					<Post
						key={mweet.id}
						name={mweet.name}
						tag={mweet.tag}
						content={mweet.content}
						date={mweet.created_at}
						picture={mweet.picture}
					/>
				))
			) : (
				<p>there are no mweets</p>
			)}
		</div>
	);
}
