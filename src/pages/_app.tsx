import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: '#6096B4',
		},
		secondary: {
			main: '#EEE9DA',
		},
	},
	typography: {
		button: {
			textTransform: 'none',
			fontWeight: 550,
		},
	},
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={theme}>
			<Component {...pageProps} />
		</ThemeProvider>
	);
}
