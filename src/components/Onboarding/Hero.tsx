import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import EyeIcon from '@untitled-ui/icons-react/build/esm/Eye';
import LayoutBottomIcon from '@untitled-ui/icons-react/build/esm/LayoutBottom';
import {
	Box,
	Button,
	Container,
	Rating,
	Stack,
	SvgIcon,
	Typography,
	useMediaQuery,
	Theme,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { RouterLink } from '@/components/router-link';
import { paths } from '@/paths';
import AuthModal from '@/components/AuthModal';
// import { HomeCodeSamples } from './home-code-samples';

export const Hero: FC = () => {
	const router = useRouter();
	const [authModal, setAuthModal] = useState(false);
	const theme = useTheme();
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	return (
		<Box
			sx={{
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'top center',
				backgroundImage: 'url("/assets/gradient-bg.svg")',
				pt: '150px',
				pb: 12,
			}}>
			<Container maxWidth="md">
				<Box textAlign="center">
					<Typography variant="h2" sx={{ mb: 2 }}>
						Ultimate companion<br/> during your journey in&nbsp;
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
							px: 7,
						}}>
						Our platform provides additional tools on top of the school&apos;s system and empowers
						you to create a vibrant network that assist your journey at UCSD.
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
						onClick={() => router.push('/vacantClassrooms')}
						variant="contained">
						Get Started
					</Button>
					<AuthModal open={authModal} setAuthModal={setAuthModal} />
				</Box>

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
