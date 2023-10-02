import { FC, useState } from 'react';
import Attachment01Icon from '@untitled-ui/icons-react/build/esm/Attachment01';
import FaceSmileIcon from '@untitled-ui/icons-react/build/esm/FaceSmile';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import Link01Icon from '@untitled-ui/icons-react/build/esm/Link01';
import type { Theme } from '@mui/material';
import {
	Autocomplete,
	Avatar,
	Button,
	Box,
	Card,
	CardContent,
	Checkbox,
	IconButton,
	OutlinedInput,
	Stack,
	SvgIcon,
	useMediaQuery,
	TextField,
	FormGroup,
	FormControlLabel,
	Popper,
	ClickAwayListener,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { homelands } from '@/constants/personalInfoOptions';
import UserAvatar from '@/components/UserAvatar';
import axios from 'axios';
import toast from 'react-hot-toast';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { KeyedMutator } from 'swr';
import { PostDetails } from '@/types/post';

interface PostAddFormProps {
	mutate: KeyedMutator<PostDetails[]>;
}

const PostAddForm: FC<PostAddFormProps> = ({ mutate }) => {
	const { data: session } = useSession();
	const [content, setContent] = useState('');
	const [anonymous, setAnonymous] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
	const [region, setRegion] = useState({
		code: 'GLB',
		label: 'Global',
		phone: '',
	});
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	const handlePost = async () => {
		if (session) {
			const res = await axios.post('/api/post', {
				anonymous,
				content: content,
				userId: session?.user.id,
			});
			mutate();
			if (res.status === 200) {
				setContent('');
				toast.success('Post created');
			}
		}
	};

	const handleEnterEmoji = (emojiData: EmojiClickData, event: MouseEvent) => {
		setContent(
			(inputValue) => inputValue + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
		);
	};

	return (
		<Card>
			<CardContent>
				<Stack alignItems="flex-start" direction="row" spacing={2}>
					<UserAvatar userId={session?.user.id} size={40} />
					<Stack spacing={1} sx={{ flexGrow: 1 }}>
						<OutlinedInput
							fullWidth
							multiline
							placeholder="Share the moment"
							rows={2}
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
						<Stack alignItems="center" direction="row" justifyContent="space-between">
							{/* {smUp && (
								<Stack alignItems="center" direction="row" spacing={1}>
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
								</Stack>
							)} */}
							<IconButton onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}>
								<SvgIcon>
									<FaceSmileIcon />
								</SvgIcon>
							</IconButton>
							<Popper anchorEl={anchorEl} open={Boolean(anchorEl)} placement="right-start">
								<ClickAwayListener onClickAway={() => setAnchorEl(null)}>
									<div>
										<EmojiPicker onEmojiClick={handleEnterEmoji} lazyLoadEmojis={true} />
									</div>
								</ClickAwayListener>
							</Popper>

							<Stack alignItems="center" direction="row" spacing={1}>
								{/* <Autocomplete
									value={region}
									options={homelands}
									isOptionEqualToValue={(option, value) => option.label === value.label}
									renderOption={(props, option) => (
										<Box
											component="li"
											sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
											{...props}>
											<img
												loading="lazy"
												width="20"
												src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
												srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
												alt=""
											/>
											{option.label}
										</Box>
									)}
									renderInput={(params): JSX.Element => (
										<TextField {...params} fullWidth label="Homeland" name="homeland" />
									)}
									// onChange={(e, values) => {
									// 	setPersonalInfo({ ...personalInfo, homeland: values?.label ?? '' });
									// }}
								/> */}
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												checked={anonymous}
												onChange={() => setAnonymous(!anonymous)}
											/>
										}
										label="Anonymous"
									/>
								</FormGroup>
								<Button
									variant="contained"
									sx={{ marginLeft: 'auto' }}
									onClick={handlePost}>
									Post
								</Button>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default PostAddForm;
