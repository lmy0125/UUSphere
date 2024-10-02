import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Logo } from '@/components/Logo';

export default function Loading() {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}>
			<Logo width={135} height={60} />
			<CircularProgress
				sx={{
					color: '#7bdece',
				}}
				size={60} // Size of the spinner
				thickness={4} // Thickness of the spinner
			/>
		</Box>
	);
}
