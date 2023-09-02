import React, { useState, useEffect, createContext, useContext } from 'react';
import { StreamChat, Channel } from 'stream-chat';
import { useSession } from 'next-auth/react';
import { Class } from '@prisma/client';
import axios from 'axios';
import { ClassInfo } from '@/types/class';

export const joinSection = async (sectionId: string, classInfo: ClassInfo) => {
	// Add in database
	try {
		axios.post('api/joinClass', { sectionId: sectionId });
	} catch (err) {
		alert('Failed joinSection ' + err);
		return false;
	}

	// Join chat channel
	// if (!chatClient) {
	// 	console.error('Chat service is down.');
	// 	return;
	// }
	// const channel = chatClient.channel('classroom', classInfo.id, {
	// 	code: classInfo.code,
	// 	name: classInfo.name ?? undefined,
	// 	instructor: classInfo.instructor,
	// 	quarter: classInfo.quarter,
	// });
	// await channel.watch();
	// await channel.addMembers([chatClient.user.id]);
};

export const dropSection = async (sectionId: string, classId: string) => {
	// Remove in databse
	try {
		axios.post('api/dropClass', { sectionId: sectionId });
	} catch (err) {
		alert('Failed dropSection ' + err);
	}

	// Leave chat channel
	// if (!chatClient) {
	// 	console.error('Chat service is down.');
	// 	return;
	// }
	// const filter = { type: 'classroom', id: { $eq: classId } };

	// const channels = await chatClient.queryChannels(filter);
	// if (channels) {
	// 	await channels[0].stopWatching();
	// 	await channels[0].removeMembers([session.user.id]);
	// }
};
