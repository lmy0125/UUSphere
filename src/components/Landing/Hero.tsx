import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import EyeIcon from '@untitled-ui/icons-react/build/esm/Eye';
import LayoutBottomIcon from '@untitled-ui/icons-react/build/esm/LayoutBottom';
import {
	Box,
	Button,
	Container,
	Card,
	CardContent,
	Grid,
	Stack,
	Typography,
	useMediaQuery,
	Theme,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AuthModal from '@/components/AuthModal';
import { useSession } from 'next-auth/react';
import BuildingCard from '@/components/Building/BuildingCard';
import HotelIcon from '@mui/icons-material/Hotel';
import DiningIcon from '@mui/icons-material/Dining';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';

export const Hero: FC = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const [authModal, setAuthModal] = useState(false);
	const theme = useTheme();
	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

	return (
		<Box
			sx={{
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'top center',
				backgroundImage: 'url("/assets/gradient-bg.svg")',
				pt: '150px',
				pb: 10,
			}}>
			<Container maxWidth="lg">
				<Grid container spacing={8}>
					<Grid item xs={12} md={7}>
						<Box maxWidth="md" sx={{ textAlign: mdUp ? 'left' : 'center' }}>
							<Typography variant="h2" sx={{ mb: 2 }}>
								Meet your future best friend and partner in&nbsp;
								<Typography component="span" color="primary.main" variant="inherit">
									UCSD&nbsp;
									<br />
								</Typography>
							</Typography>
							<Typography
								color="text.secondary"
								sx={{
									fontSize: 20,
									fontWeight: 500,
								}}>
								UUSphere is built by a single student in UCSD, and he hope that students who are attending UCSD
								can find this platform somewhat helpful, and enjoy the life in San Diego.
							</Typography>

							<Button
								sx={(theme) =>
									theme.palette.mode === 'dark'
										? {
												backgroundColor: 'neutral.50',
												color: 'neutral.900',
												'&:hover': {
													backgroundColor: 'neutral.200',
												},
												mt: 3,
										  }
										: {
												backgroundColor: 'neutral.900',
												color: 'neutral.50',
												'&:hover': {
													backgroundColor: 'neutral.700',
												},
												mt: 3,
										  }
								}
								onClick={() => (session ? router.push('/chat') : setAuthModal(true))}
								variant="contained">
								Get Started
							</Button>
							<AuthModal open={authModal} setAuthModal={setAuthModal} />
						</Box>
					</Grid>
					<Grid item xs={12} md={5}>
						<Box
							sx={
								{
									// py: mdUp ? '20px' : '0',
									// position: 'relative',
								}
							}>
							<Card sx={{ maxWidth: 'md', minWidth: '320px', width: '100%' }}>
								<CardContent
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										pb: 2,
									}}>
									<div>
										<Typography variant="h6" component="div">
											Geisel Library
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Total People: 164
										</Typography>
									</div>
								</CardContent>
								<CardContent
									sx={{
										display: 'grid',
										gridTemplateColumns: 'repeat(2, 1fr)',
										gap: 2,
									}}>
									{[
										// Array of objects representing each status
										{ icon: <SelfImprovementIcon fontSize="large" />, number: 62, text: 'Chilling' },
										{ icon: <LaptopMacIcon fontSize="large" />, number: 75, text: 'Studying' },
										{ icon: <DiningIcon fontSize="large" />, number: 9, text: 'Eating' },
										{ icon: <HotelIcon fontSize="large" />, number: 18, text: 'Sleeping' },
									].map((status) => (
										<Box
											key={status.text}
											sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
											{status.icon}
											<Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
												{status.number}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{status.text}
											</Typography>
										</Box>
									))}
								</CardContent>
							</Card>
						</Box>
					</Grid>
				</Grid>

				{/* <Box
          sx={{
            pt: '120px',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              overflow: 'hidden',
              width: '90%',
              fontSize: 0,
              mt: -2, // hack to cut the bottom box shadow
              mx: -2,
              pt: 2,
              px: 2,
              '& img': {
                borderTopLeftRadius: (theme) => theme.shape.borderRadius * 2.5,
                borderTopRightRadius: (theme) => theme.shape.borderRadius * 2.5,
                boxShadow: 16,
                width: '100%'
              }
            }}
          >
            <img
              src={
                theme.palette.mode === 'dark'
                  ? '/assets/home-thumbnail-dark.png'
                  : '/assets/home-thumbnail-light.png'
              }
            />
          </Box>
          <Box
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              position: 'absolute',
              right: 0,
              top: 40,
              '& > div': {
                height: 460,
                width: 560
              }
            }}
          >
            <HomeCodeSamples />
          </Box>
        </Box> */}
			</Container>
		</Box>
	);
};
