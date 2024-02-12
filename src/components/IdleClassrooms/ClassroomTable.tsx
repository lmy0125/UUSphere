import type { ChangeEvent, Dispatch, FC, MouseEvent, SetStateAction } from 'react';
import { useCallback, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import {
	Box,
	Button,
	Card,
	Collapse,
	IconButton,
	Slider,
	SvgIcon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from '@mui/material';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Scrollbar } from '@/components/scrollbar';
import { ClassroomIdleTimes, TimeInterval } from '@/types/classroom';
import { Timeline } from '@/components/IdleClassrooms/Timeline';

interface ClassroomsTableProps {
	count?: number;
	items?: ClassroomIdleTimes[];
	onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
	onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	page?: number;
	rowsPerPage?: number;
	day: number;
}

const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ClassroomTable: FC<ClassroomsTableProps> = (props) => {
	const {
		count = 0,
		items = [],
		onPageChange = () => {},
		onRowsPerPageChange,
		page = 0,
		rowsPerPage = 0,
	} = props;
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	return (
		<>
			<Scrollbar>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>Name</TableCell>
							<TableCell width="60%">Vacant Time {daysMap[props.day]}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((classroom) => {
								return <Row key={classroom.name} classroom={classroom} day={props.day} />;
							})}
					</TableBody>
				</Table>
			</Scrollbar>

			<TablePagination
				component="div"
				count={count}
				onPageChange={onPageChange}
				onRowsPerPageChange={onRowsPerPageChange}
				page={page}
				rowsPerPage={rowsPerPage}
				rowsPerPageOptions={[5, 10, 25]}
				labelRowsPerPage="Rows"
			/>
		</>
	);
};

ClassroomTable.propTypes = {
	count: PropTypes.number,
	items: PropTypes.array,
	onPageChange: PropTypes.func,
	onRowsPerPageChange: PropTypes.func,
	page: PropTypes.number,
	rowsPerPage: PropTypes.number,
};

const Row: FC<{
	classroom: ClassroomIdleTimes;
	day: number;
}> = ({ classroom: classroom, day: day }) => {
	const [expandSection, setExpandSection] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	const handleClassToggle = () => {
		setExpandSection(!expandSection);
	};

	return (
		<>
			<TableRow hover key={classroom.name}>
				<TableCell
					padding="checkbox"
					sx={{
						...(expandSection && {
							position: 'relative',
							'&:after': {
								position: 'absolute',
								content: '" "',
								top: 0,
								left: 0,
								backgroundColor: 'primary.main',
								width: 3,
								height: 'calc(100% + 1px)',
							},
						}),
					}}>
					<IconButton onClick={() => handleClassToggle()}>
						<SvgIcon>{expandSection ? <ChevronDownIcon /> : <ChevronRightIcon />}</SvgIcon>
					</IconButton>
				</TableCell>
				<TableCell
					sx={{ cursor: 'pointer' }}
					onClick={(e) => {
						setAnchorEl(e.currentTarget);
					}}>
					<a
						href={`https://act.ucsd.edu/maps/?isisCode=${classroom.name.split(' ')[0]}`}
						target="_blank"
						rel="noopener noreferrer"
						style={{ textDecoration: 'none', color: 'inherit' }}>
						<Typography variant="subtitle2">{classroom.name}</Typography>
					</a>
				</TableCell>

				<TableCell>
					<Timeline timeIntervals={classroom.idleTimes[day]} />
				</TableCell>
			</TableRow>

			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={expandSection} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Day</TableCell>
										<TableCell>Vacant Time</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{classroom.idleTimes.map((timeInterval, index) => {
										if (index != 0 && index != 6) {
											return (
												<SubRow key={index} index={index} timeInterval={timeInterval} />
											);
										}
									})}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

const SubRow: FC<{
	index: number;
	timeInterval: TimeInterval[];
}> = ({ timeInterval: timeInterval, index: index }) => {
	return (
		<TableRow>
			<TableCell>{daysMap[index]}</TableCell>

			<TableCell>
				<Timeline timeIntervals={timeInterval} />
			</TableCell>
		</TableRow>
	);
};
