// menuButton.tsx
//

import styles from "../styles/menuButton.module.sass";
import Image from "next/image";
import Link from "next/link";
export default function MenuButton({
	href,
	src,
	alt,
	text,
}: {
	href: string;
	src: string;
	alt: string;
	text: string;
}) {
	return (
		<Link href={href} className={styles.button}>
			<Image src={src} alt={alt} className={styles.icon} />
			<span className={styles.buttonText}>{text}</span>
		</Link>
	);
}
