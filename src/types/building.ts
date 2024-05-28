import { User } from '@prisma/client';

export interface DbBuilding {
	id: string;
	name: string;
}

export interface BuildingInfo extends DbBuilding {
	users: User[];
	_count: { users: number };
}

export interface MapBuilding {
	displayName: {
		text: string;
	};
}
