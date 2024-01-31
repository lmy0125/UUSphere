import React, { useState } from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import {
	Box,
	Button,
	Container,
	OutlinedInput,
	Typography,
	Stack,
	Paper,
	Unstable_Grid2 as Grid,
	InputLabel,
	Select,
	MenuItem,
	FormControl,
	SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import AuthModal from '@/components/AuthModal';

const Contact: PageType = () => {
	const { data: session, status } = useSession();
	const [authModal, setAuthModal] = useState(false);
	const [formData, setFormData] = useState({
		recipientEmail: session?.user.email,
		type: 'Feedback',
		subject: '',
		message: '',
	});
	const [sendSuccess, setSendSuccess] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
	) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await axios.post('/api/emailServer', formData);
			if (response.status === 200) {
				setFormData({ ...formData, subject: '', message: '' });
				setSendSuccess(true);
			}
		} catch (e) {
			alert('Sorry, failed to send message.');
			console.error('Failed to send email. ', e);
		}
	};

	if (status === 'loading') {
		return <></>;
	} else if (status !== 'authenticated') {
		return (
			<Container maxWidth="xl" sx={{ mt: 1 }}>
				<Typography variant="h4">Contact Us</Typography>
				<Typography variant="subtitle2">
					Please feel free to share any thoughts or suggestions you have!
				</Typography>
				<Stack sx={{ alignItems: 'center', mt: 8 }}>
					<Button variant="contained" onClick={() => setAuthModal(true)}>
						Login
					</Button>
					<AuthModal open={authModal} setAuthModal={setAuthModal} />
				</Stack>
			</Container>
		);
	}

	if (sendSuccess) {
		return (
			<Container maxWidth="md" sx={{ mt: 1, pb: 8 }}>
				<Typography variant="h6" sx={{ textAlign: 'center' }}>
					Thank you for your message! We&apos;ll review it carefully to make improvements.
					<br />
					We&apos;re here to improve your experience in university.
				</Typography>
				<Button
					variant="contained"
					onClick={() => setSendSuccess(false)}
					sx={{ float: 'right', mt: 4 }}>
					Back
				</Button>
			</Container>
		);
	}

	return (
		<Container maxWidth="xl" sx={{ mt: 1, pb: 8 }}>
			<div>
				<Typography variant="h4">Contact Us</Typography>
				<Typography variant="subtitle2">
					Please feel free to share any thoughts or suggestions you have!
				</Typography>
			</div>
			<Paper elevation={3} sx={{ p: 3, my: 2 }}>
				<form onSubmit={handleSubmit}>
					<Grid container spacing={3}>
						<Grid xs={12} lg={6}>
							<FormControl fullWidth>
								<Typography sx={{ mb: 1 }} variant="subtitle2">
									Type
								</Typography>
								<Select value={formData.type} onChange={handleChange} name="type">
									<MenuItem value="Feedback">Feedback</MenuItem>
									<MenuItem value="Bug Report">Bug Report</MenuItem>
									<MenuItem value="Feature Request">Feature Request</MenuItem>
									<MenuItem value="Cooperation">Cooperation</MenuItem>
									<MenuItem value="Other">Other</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid xs={12} lg={6}>
							<Typography sx={{ mb: 1 }} variant="subtitle2">
								Subject
							</Typography>
							<OutlinedInput
								fullWidth
								required
								name="subject"
								value={formData.subject}
								onChange={handleChange}
							/>
						</Grid>

						<Grid xs={12}>
							<Typography sx={{ mb: 1 }} variant="subtitle2">
								Message
							</Typography>
							<OutlinedInput
								fullWidth
								name="message"
								required
								multiline
								rows={6}
								value={formData.message}
								onChange={handleChange}
							/>
						</Grid>
					</Grid>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							mt: 3,
						}}>
						<Button type="submit" color="primary" fullWidth size="large" variant="contained">
							Submit
						</Button>
					</Box>
				</form>
			</Paper>
		</Container>
	);
};

Contact.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Contact;
