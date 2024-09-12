import { User as U, Class, Section } from '@prisma/client';

export interface BigHeadStyle {
	accessory?: string;
	body?: string;
	circleColor?: string;
	clothing?: string;
	clothingColor?: string;
	eyebrows?: string;
	eyes?: string;
	facialHair?: string;
	graphic?: string;
	hair?: string;
	hairColor?: string;
	hat?: string;
	hatColor?: string;
	lashes?: string;
	lipColor?: string;
	mouth?: string;
	skinTone?: string;
}

export interface BigHeadAvatar extends BigHeadStyle {
	selected: boolean;
	backgroundColor?: string;
}

export interface User extends U {
	bigHeadAvatar?: BigHeadAvatar | undefined;
	classes?: Class[];
	sections?: Section[];
}
