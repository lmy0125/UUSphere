import { useState, type FC } from 'react';
import FaceSmileIcon from '@untitled-ui/icons-react/build/esm/FaceSmile';
import Link01Icon from '@untitled-ui/icons-react/build/esm/Link01';
import Attachment01Icon from '@untitled-ui/icons-react/build/esm/Attachment01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import type { Theme } from '@mui/material';
import {
	Avatar,
	Button,
	IconButton,
	Stack,
	SvgIcon,
	TextField,
	useMediaQuery,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import UserAvatar from '@/components/UserAvatar';
import useComment from '@/hooks/useComment';

interface CommentCreateProps {
	postId: string;
}

export const CommentCreate: FC<CommentCreateProps> = ({ postId }) => {
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	// const user = useMockedUser();
	const { data: session } = useSession();
	const { createComment } = useComment({ postId });
	const [content, setContent] = useState('');
	const handlePost = async () => {
		if (session && content) {
			createComment({ content, userId: session.user.id });
			setContent('');
		}
	};

	return (
		<div>
			<Stack alignItems="flex-start" direction="row" spacing={2}>
				<UserAvatar userId={session?.user.id} size={40} />

				<Stack spacing={3} sx={{ flexGrow: 1 }}>
					<TextField
						fullWidth
						multiline
						placeholder="Type your comment"
						variant="outlined"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
					<Stack
						alignItems="center"
						direction="row"
						justifyContent="space-between"
						spacing={3}>
						<Stack alignItems="center" direction="row" spacing={1}>
							{/* {!smUp && (
								<IconButton>
									<SvgIcon>
										<PlusIcon />
									</SvgIcon>
								</IconButton>
							)}
							{smUp && (
								<>
									<IconButton>
										<SvgIcon>
											<Image01Icon />
										</SvgIcon>
									</IconButton>
									<IconButton>
										<SvgIcon>
											<Attachment01Icon />
										</SvgIcon>
									</IconButton>
									<IconButton>
										<SvgIcon>
											<Link01Icon />
										</SvgIcon>
									</IconButton>
									<IconButton>
										<SvgIcon>
											<FaceSmileIcon />
										</SvgIcon>
									</IconButton>
								</>
							)} */}
						</Stack>
						<div>
							<Button variant="contained" onClick={handlePost}>
								Comment
							</Button>
						</div>
					</Stack>
				</Stack>
			</Stack>
		</div>
	);
};
