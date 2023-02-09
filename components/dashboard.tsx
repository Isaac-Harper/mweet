// dashboard.tsx
//

import Menu from "../components/menu";
import { Mweeter } from "../interfaces";
import styles from "../styles/dashboard.module.sass";

export default function Dashboard({
	children,
	userMweeter,
}: {
	children: any;
	userMweeter: Mweeter;
}) {
	return (
		<div className={styles.container}>
			<Menu userMweeter={userMweeter} />
			<div className={styles.inner}>{children}</div>
		</div>
	);
}
