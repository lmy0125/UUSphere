import { TimeInterval } from '@/types/classroom';
import React, { FC } from 'react';

interface TimelineProps {
	timeIntervals: TimeInterval[];
}

export const Timeline: FC<TimelineProps> = (props) => {
	return (
		<>
			{props.timeIntervals.map((interval, index) => {
				const comma = index == props.timeIntervals.length - 1 ? '' : ', ';
				return interval.start + '--' + interval.end + comma;
			})}
		</>
	);
};
