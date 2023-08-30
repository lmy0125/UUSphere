import type { FC } from 'react';
import EyeIcon from '@untitled-ui/icons-react/build/esm/Eye';
import LayoutBottomIcon from '@untitled-ui/icons-react/build/esm/LayoutBottom';
import { Box, Button, Container, Rating, Stack, SvgIcon, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { RouterLink } from '@/components/router-link';
import { paths } from '@/paths';
// import { HomeCodeSamples } from './home-code-samples';

const Hero: FC = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'top center',
				backgroundImage: 'url("/assets/gradient-bg.svg")',
				pt: '120px',
			}}>
			<Container maxWidth="lg">
				<Box maxWidth="sm">
					<Typography variant="h1" sx={{ mb: 2 }}>
						Your ultimate companion for an enriched&nbsp;
						{/* Let us worry about the&nbsp; */}
						<Typography component="span" color="primary.main" variant="inherit">
							University Experience
						</Typography>
					</Typography>
					<Typography
						color="text.secondary"
						sx={{
							fontSize: 20,
							fontWeight: 500,
						}}>
						Our innovative platform empowers you to connect with fellow students, effortlessly
						join classes of interest, and create a vibrant network that enhances your journey
						through higher education.
					</Typography>
					<Stack alignItems="center" direction="row" spacing={2} sx={{ my: 3 }}>
						<Button
							component={RouterLink}
							href={paths.dashboard.index}
							startIcon={
								<SvgIcon fontSize="small">
									<EyeIcon />
								</SvgIcon>
							}
							sx={(theme) =>
								theme.palette.mode === 'dark'
									? {
											backgroundColor: 'neutral.50',
											color: 'neutral.900',
											'&:hover': {
												backgroundColor: 'neutral.200',
											},
									  }
									: {
											backgroundColor: 'neutral.900',
											color: 'neutral.50',
											'&:hover': {
												backgroundColor: 'neutral.700',
											},
									  }
							}
							variant="contained">
							Get Started
						</Button>
						{/* <Button
							color="inherit"
							component={RouterLink}
							href={paths.components.index}
							startIcon={
								<SvgIcon fontSize="small">
									<LayoutBottomIcon />
								</SvgIcon>
							}>
							Components
						</Button> */}
					</Stack>
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

export default Hero;
