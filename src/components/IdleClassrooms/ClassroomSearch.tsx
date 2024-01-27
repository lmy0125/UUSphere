import type { FC, KeyboardEvent } from 'react';
import { FormEvent, useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {
	Box,
	Button,
	Input,
	Grid,
	Stack,
	SvgIcon,
	Slider,
	Switch,
	TextField,
	Typography,
	FormControlLabel,
	useMediaQuery,
	Theme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { ClassroomFilters } from '@/types/classroom';

interface ClassroomSearchProps {
	onFiltersChange?: (filters: ClassroomFilters) => void;
	day: number;
}

interface Option {
	label: string;
	value: number;
}

const dayOptions: Option[] = [
	{ label: 'Monday', value: 1 },
	{ label: 'Tuesday', value: 2 },
	{ label: 'Wednesday', value: 3 },
	{ label: 'Thursday', value: 4 },
	{ label: 'Friday', value: 5 },
	{ label: 'Saturday', value: 6 },
	{ label: 'Sunday', value: 0 },
];

const timeIntervalMarks = [
	{
		value: 8,
		label: '08:00',
	},
	{
		value: 13,
		label: '13:00',
	},
	{
		value: 17,
		label: '17:00',
	},
	{
		value: 22,
		label: '22:00',
	},
];

// Function to format slider value to time string
const valuetext = (value: number): string => {
	const hours = Math.floor(value);
	const minutes = Math.floor((value % 1) * 60);
	return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

const timeFromSliderValue = (value: number): string => {
	const totalMinutes = value * 60; // Convert slider value to minutes since 8:00
	const hours = Math.floor(totalMinutes / 60);
	const minutes = Math.floor(totalMinutes % 60);
	// Convert to "HH:MM" format
	const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
	return `${formattedHours}:${formattedMinutes}`;
};

export const ClassroomSearch: FC<ClassroomSearchProps> = (props) => {
	const { onFiltersChange, ...other } = props;
	const [inputValue, setInputValue] = useState<string>('');
	const timestamp = new Date();
	const hours = timestamp.getHours();
	const minutes = timestamp.getMinutes();
	const [day, setDay] = useState<number>(timestamp.getDay());
	// State for start and end times
	const [timeInterval, setTimeInterval] = useState<[number, number]>([
		hours + minutes / 60,
		hours + minutes / 60,
	]);
	const [disableSlider, setDisableSlider] = useState<boolean>(false);
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	const handleTimeIntervalChange = (event: Event, newValue: number | number[]): void => {
		setTimeInterval(newValue as [number, number]); // Casting newValue to a tuple of numbers
	};

	const startTime =
		timeInterval[0] > timeInterval[1]
			? timeFromSliderValue(timeInterval[1])
			: timeFromSliderValue(timeInterval[0]);

	const endTime =
		timeInterval[0] < timeInterval[1]
			? timeFromSliderValue(timeInterval[1])
			: timeFromSliderValue(timeInterval[0]);

	const handleApplyFilters = () => {
		onFiltersChange?.({
			name: inputValue,
			day: day,
			startTime: disableSlider ? '' : startTime,
			endTime: disableSlider ? '' : endTime,
		});
	};

	return (
		<div {...other}>
			<Stack component="form" direction="column" spacing={2} sx={{ p: 2 }}>
				<Stack direction="row" spacing={2}>
					<SvgIcon>
						<SearchMdIcon />
					</SvgIcon>
					<Input
						disableUnderline
						fullWidth
						placeholder="Search by classroom's name"
						sx={{ flexGrow: 1 }}
						value={inputValue}
						onChange={(e) => {
							setInputValue(e.target.value);
						}}
						onKeyDown={(e: KeyboardEvent) => {
							if (e.key === 'Enter') {
								handleApplyFilters();
							}
						}}
					/>
				</Stack>
				<Stack
					direction="row"
					spacing={smUp ? 2 : 0}
					flexWrap="wrap"
					justifyContent="space-between"
					alignItems="center">
					<TextField
						label="Day"
						name="Day"
						select
						value={day}
						SelectProps={{ native: true }}
						sx={{
							maxWidth: '100%',
							width: 240,
						}}
						onChange={(e) => setDay(Number(e.target.value))}>
						{dayOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</TextField>

					<Box
						sx={{
							minWidth: 280,
							px: 2,
						}}>
						<Stack
							direction="row"
							justifyContent="space-between"
							spacing={4}
							mt={smUp ? 0 : 2}>
							<Typography id="input-slider" gutterBottom>
								Time Interval
							</Typography>
							<FormControlLabel
								control={
									<Switch
										checked={disableSlider}
										size="small"
										onChange={(e) => setDisableSlider(e.target.checked)}
									/>
								}
								label="Disabled"
							/>
						</Stack>
						<Box sx={{ minWidth: 150 }}>
							<Slider
								disabled={disableSlider}
								value={timeInterval}
								min={8}
								max={22}
								step={0.5} // 30 minute increments
								getAriaValueText={valuetext}
								valueLabelDisplay="auto"
								valueLabelFormat={valuetext}
								onChange={handleTimeIntervalChange}
								marks={timeIntervalMarks}
							/>
						</Box>
					</Box>

					{/* <LocalizationProvider dateAdapter={AdapterDayjs}>
						<TimePicker
							label="Start Time"
							value={startTime}
							onChange={(newValue) => setStartTime(newValue)}
						/>
					</LocalizationProvider>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<TimePicker
							label="End Time"
							value={endTime}
							onChange={(newValue) => setEndTime(newValue)}
						/>
					</LocalizationProvider> */}

					<Button variant="outlined" onClick={handleApplyFilters}>
						Apply
					</Button>
				</Stack>
			</Stack>
		</div>
	);
};

ClassroomSearch.propTypes = {
	onFiltersChange: PropTypes.func,
};
