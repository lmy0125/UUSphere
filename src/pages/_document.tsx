import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" href="/logo-icon.png"></link>
				<link rel="icon" href="/logo-icon.ico"></link>
				<meta name="theme-color" content="#fff" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
