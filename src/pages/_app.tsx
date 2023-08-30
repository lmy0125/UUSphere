// import '@/styles/globals.css';
import '@/styles/customMessage.scss';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import Head from 'next/head';
import type { NextPage } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@/theme';
import { SettingsConsumer, SettingsProvider } from '@/contexts/settings-context';
import { SessionProvider as AuthProvider } from 'next-auth/react';
import ChatContextProvider from '@/contexts/ChatContext';
// Remove if simplebar is not used
import 'simplebar-react/dist/simplebar.min.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<AuthProvider session={session}>
			<ChatContextProvider>
				<SettingsProvider>
					<SettingsConsumer>
						{(settings) => {
							// Prevent theme flicker when restoring custom settings from browser storage
							if (!settings.isInitialized) {
								// return null;
							}

							const theme = createTheme({
								colorPreset: settings.colorPreset,
								contrast: settings.contrast,
								direction: settings.direction,
								paletteMode: settings.paletteMode,
								responsiveFontSizes: settings.responsiveFontSizes,
							});

							// Prevent guards from redirecting
							// const showSlashScreen = !auth.isInitialized;

							return (
								<ThemeProvider theme={theme}>
									<Head>
										<meta name="color-scheme" content={settings.paletteMode} />
										<meta name="theme-color" content={theme.palette.neutral[900]} />
									</Head>
									{/* <RTL direction={settings.direction}> */}
									<CssBaseline />
									{/* {showSlashScreen ? (
									<SplashScreen />
								) : ( */}
									<>
										{getLayout(<Component {...pageProps} />)}

										{/* <SettingsButton onClick={settings.handleDrawerOpen} />
										<SettingsDrawer
											canReset={settings.isCustom}
											onClose={settings.handleDrawerClose}
											onReset={settings.handleReset}
											onUpdate={settings.handleUpdate}
											open={settings.openDrawer}
											values={{
												colorPreset: settings.colorPreset,
												contrast: settings.contrast,
												direction: settings.direction,
												paletteMode: settings.paletteMode,
												responsiveFontSizes: settings.responsiveFontSizes,
												stretch: settings.stretch,
												layout: settings.layout,
												navColor: settings.navColor,
											}}
										/> */}
									</>
									{/* )}
								<Toaster />
							</RTL> */}
								</ThemeProvider>
							);
						}}
					</SettingsConsumer>
				</SettingsProvider>
			</ChatContextProvider>
		</AuthProvider>
	);
}
