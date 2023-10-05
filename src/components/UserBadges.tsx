import React from 'react';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { Tooltip } from '@mui/material';
import { User } from '@prisma/client';

export default function UserBadges({ user }: { user: User }) {
	return (
		<>
			{user.gender === 'Male' && <MaleIcon fontSize="small" sx={{ ml: 1 }} />}
			{user.gender === 'Female' && <FemaleIcon fontSize="small" sx={{ ml: 1 }} />}
			{user.gender === 'Non-binary' && <HorizontalRuleIcon fontSize="small" sx={{ ml: 1 }} />}

			{user.verifiedStudent && (
				<Tooltip title="Verified Student" arrow placement="top">
					<HowToRegIcon color="success" sx={{ height: 22, width: 22 }} />
				</Tooltip>
			)}
		</>
	);
}
