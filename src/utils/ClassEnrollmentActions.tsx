import React, { useState, useEffect, createContext, useContext } from 'react';
import { StreamChat, Channel, DefaultGenerics } from 'stream-chat';
import { useSession } from 'next-auth/react';
import { Class } from '@prisma/client';
import axios from 'axios';
import { ClassInfo } from '@/types/class';

export const joinSection = async (
	sectionId: string,
	classInfo: ClassInfo,
	chatClient: StreamChat<DefaultGenerics>
) => {
	// Add in database
	try {
		axios.post('api/joinClass', { sectionId: sectionId });
	} catch (err) {
		alert('Failed joinSection ' + err);
		return false;
	}

	// Join chat channel
	const channel = chatClient.channel('classroom', classInfo.id, {
		code: classInfo.code,
		name: classInfo.name ?? undefined,
		instructor: classInfo.instructor,
		quarter: classInfo.quarter,
	});
	await channel.watch();
	await channel.addMembers([chatClient.user?.id ?? '']);
};

export const dropSection = async (
	sectionId: string,
	classId: string,
	chatClient: StreamChat<DefaultGenerics>
) => {
	// Remove in databse
	try {
		axios.post('api/dropClass', { sectionId: sectionId });
	} catch (err) {
		alert('Failed dropSection ' + err);
	}

	// Leave chat channel
	const filter = { type: 'classroom', id: { $eq: classId } };

	const channels = await chatClient.queryChannels(filter);
	if (channels) {
		await channels[0].stopWatching();
		await channels[0].removeMembers([chatClient.user?.id ?? '']);
	}
};
