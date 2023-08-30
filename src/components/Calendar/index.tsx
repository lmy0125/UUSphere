import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DateSelectArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Box, Card, Container, Stack, Theme, useMediaQuery } from '@mui/material';
import { useDialog } from '@/hooks/use-dialog';
// import { CalendarEventDialog } from 'src/sections/dashboard/calendar/calendar-event-dialog';
import { CalendarToolbar } from './calendar-toolbar';
import { CalendarContainer } from './calendar-container';
// import { useDispatch, useSelector } from 'src/store';
// import { thunks } from 'src/thunks/calendar';
import type { CalendarEvent, CalendarView } from '@/types/calendar';
import type { Page as PageType } from '@/types/page';
import { Section } from '@/types/class';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface CreateDialogData {
	range?: {
		start: number;
		end: number;
	};
}

interface UpdateDialogData {
	eventId?: string;
}

// const useEvents = (): CalendarEvent[] => {
//   const dispatch = useDispatch();
//   const events = useSelector((state) => state.calendar.events);

//   const handleEventsGet = useCallback(
//     (): void => {
//       dispatch(thunks.getEvents());
//     },
//     [dispatch]
//   );

//   useEffect(
//     () => {
//       handleEventsGet();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   );

//   return events;
// };

const useCurrentEvent = (
	events: CalendarEvent[],
	dialogData?: UpdateDialogData
): CalendarEvent | undefined => {
	return useMemo((): CalendarEvent | undefined => {
		if (!dialogData) {
			return undefined;
		}

		return events.find((event) => event.id === dialogData!.eventId);
	}, [dialogData, events]);
};

const Calendar: PageType = () => {
	// const dispatch = useDispatch();
	const { data: session } = useSession();
	const calendarRef = useRef<FullCalendar | null>(null);
	const [sections, setSections] = useState<Section[]>();
	const [events, setEvents] = useState<EventInput[]>();

	useEffect(() => {
		const getEnrolledClassesMeetings = async () => {
			try {
				const response = await axios.get(`/api/getEnrolledClasses`);
				const getMeetings = (section: Section, color: string): EventInput[] => {
					const meetings = section.meetings.map((meeting) => {
						const event: EventInput = {
							groupId: meeting.id,
							color: color,
							// description: 'description',
							startTime: meeting.startTime,
							endTime: meeting.endTime,
							startRecur: '2023-05-30',
							endRecur: '2023-06-30',
							title: section.class.code + ' ' + meeting.type,
							daysOfWeek: meeting.daysOfWeek,
							editable: false,
						};
						return event;
					});
					return meetings;
				};
				let eventsArray: EventInput[] = [];
				const colors = [
					'#008b8b', // Turquoise
					'#8b3e2f', // Coral
					'#682d68', // Orchid
					'#335e00', // Chartreuse
					'#2e002d', // Indigo
					'#660000', // Crimson
					'#b38b00', // Gold
					'#4d4361', // SlateBlue
					'#944d3e', // Salmon
					'#004d00', // Lime
				];
				for (const [index, section] of response.data.sections.entries()) {
					eventsArray = eventsArray.concat(getMeetings(section, colors[index]));
				}
				// const formatEvents = response.data.sections.map((section: Section) => {
				// 	return getMeetings(section);
				// });
				// if (isMounted()) {
				setEvents(eventsArray);
				// }
			} catch (err) {
				console.error(err);
			}
		};
		if (session) {
			getEnrolledClassesMeetings();
		}
	}, [session]);

	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
	const [date, setDate] = useState<Date>(new Date());
	const [view, setView] = useState<CalendarView>(mdUp ? 'timeGridDay' : 'timeGridWeek');
	const createDialog = useDialog<CreateDialogData>();
	const updateDialog = useDialog<UpdateDialogData>();
	// const updatingEvent = useCurrentEvent(events, updateDialog.data);

	const handleScreenResize = useCallback((): void => {
		const calendarEl = calendarRef.current;

		if (calendarEl) {
			const calendarApi = calendarEl.getApi();
			const newView = mdUp ? 'timeGridWeek' : 'timeGridDay';

			calendarApi.changeView(newView);
			setView(newView);
		}
	}, [calendarRef, mdUp]);

	useEffect(
		() => {
			handleScreenResize();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[mdUp]
	);

	const handleViewChange = useCallback((view: CalendarView): void => {
		const calendarEl = calendarRef.current;

		if (calendarEl) {
			const calendarApi = calendarEl.getApi();

			calendarApi.changeView(view);
			setView(view);
		}
	}, []);

	const handleDateToday = useCallback((): void => {
		const calendarEl = calendarRef.current;

		if (calendarEl) {
			const calendarApi = calendarEl.getApi();

			calendarApi.today();
			setDate(calendarApi.getDate());
		}
	}, []);

	const handleDatePrev = useCallback((): void => {
		const calendarEl = calendarRef.current;

		if (calendarEl) {
			const calendarApi = calendarEl.getApi();

			calendarApi.prev();
			setDate(calendarApi.getDate());
		}
	}, []);

	const handleDateNext = useCallback((): void => {
		const calendarEl = calendarRef.current;

		if (calendarEl) {
			const calendarApi = calendarEl.getApi();

			calendarApi.next();
			setDate(calendarApi.getDate());
		}
	}, []);

	const handleAddClick = useCallback((): void => {
		createDialog.handleOpen();
	}, [createDialog]);

	const handleRangeSelect = useCallback(
		(arg: DateSelectArg): void => {
			const calendarEl = calendarRef.current;

			if (calendarEl) {
				const calendarApi = calendarEl.getApi();

				calendarApi.unselect();
			}

			createDialog.handleOpen({
				range: {
					start: arg.start.getTime(),
					end: arg.end.getTime(),
				},
			});
		},
		[createDialog]
	);

	const handleEventSelect = useCallback(
		(arg: EventClickArg): void => {
			updateDialog.handleOpen({
				eventId: arg.event.id,
			});
		},
		[updateDialog]
	);

	// const handleEventResize = useCallback(
	//   async (arg: EventResizeDoneArg): Promise<void> => {
	//     const { event } = arg;

	//     try {
	//       await dispatch(thunks.updateEvent({
	//         eventId: event.id,
	//         update: {
	//           allDay: event.allDay,
	//           start: event.start?.getTime(),
	//           end: event.end?.getTime()
	//         }
	//       }));
	//     } catch (err) {
	//       console.error(err);
	//     }
	//   },
	//   [dispatch]
	// );

	// const handleEventDrop = useCallback(
	//   async (arg: EventDropArg): Promise<void> => {
	//     const { event } = arg;

	//     try {
	//       await dispatch(thunks.updateEvent({
	//         eventId: event.id,
	//         update: {
	//           allDay: event.allDay,
	//           start: event.start?.getTime(),
	//           end: event.end?.getTime()
	//         }
	//       }));
	//     } catch (err) {
	//       console.error(err);
	//     }
	//   },
	//   [dispatch]
	// );

	return (
		<>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
				}}>
				<Container maxWidth="xl">
					<Stack spacing={3}>
						<CalendarToolbar
							date={date}
							onAddClick={handleAddClick}
							onDateNext={handleDateNext}
							onDatePrev={handleDatePrev}
							onDateToday={handleDateToday}
							onViewChange={handleViewChange}
							view={view}
						/>
						<Card>
							<CalendarContainer>
								<FullCalendar
									allDayMaintainDuration
									dayMaxEventRows={3}
									droppable
									editable
									eventClick={handleEventSelect}
									eventDisplay="block"
									// eventDrop={handleEventDrop}
									eventResizableFromStart
									// eventResize={handleEventResize}
									events={events}
									headerToolbar={false}
									height={800}
									initialDate={date}
									initialView={view}
									plugins={[
										dayGridPlugin,
										interactionPlugin,
										listPlugin,
										timeGridPlugin,
										// timelinePlugin,
									]}
									ref={calendarRef}
									rerenderDelay={10}
									select={handleRangeSelect}
									selectable
									weekends
								/>
							</CalendarContainer>
						</Card>
					</Stack>
				</Container>
			</Box>
			{/* <CalendarEventDialog
        action="create"
        onAddComplete={createDialog.handleClose}
        onClose={createDialog.handleClose}
        open={createDialog.open}
        range={createDialog.data?.range}
      />
      <CalendarEventDialog
        action="update"
        event={updatingEvent}
        onClose={updateDialog.handleClose}
        onDeleteComplete={updateDialog.handleClose}
        onEditComplete={updateDialog.handleClose}
        open={updateDialog.open}
      /> */}
		</>
	);
};

export default Calendar;
