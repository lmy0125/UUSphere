
import {
	DefaultAttachmentType,
	DefaultChannelType,
	DefaultMessageType,
} from 'stream-chat-react/dist/types/types';
import { LiteralStringForUnion, UnknownType } from 'stream-chat';

export interface CustomStreamChatUserType {
	[key: string]: string | boolean | null;
	id: string;
	name: string;
	image: string;
	email: string;
	college: string | null;
	gender: string | null;
	grade: string | null;
	major: string | null;
	verifiedStudent: boolean | null;
	homeland: string | null;
	bio: string | null;
}

export interface CustomStreamChatGenerics {
	attachmentType: DefaultAttachmentType;
	channelType: DefaultChannelType;
	commandType: LiteralStringForUnion;
	eventType: UnknownType;
	messageType: DefaultMessageType;
	reactionType: UnknownType;
	userType: CustomStreamChatUserType;
}
