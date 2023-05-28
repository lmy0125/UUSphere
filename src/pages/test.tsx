import React, { useState, useEffect, PropsWithChildren } from 'react';
import { ChannelSort } from 'stream-chat';
import {
	Chat,
	Channel,
	ChannelHeader,
	ChannelList,
	MessageInput,
	MessageList,
	Thread,
	Window,
	LoadingIndicator,
	useMessageContext,
	ChannelListMessengerProps,
	ChatDownProps,
	ChannelPreviewUIComponentProps,
	useChatContext as useStreamChatContext,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { useChatContext } from '@/contexts/ChatContext';
import type { Page as PageType } from '@/types/page';
import { ChatDown, LoadingChannels } from 'stream-chat-react';

const filters = { type: 'messaging' };
const sort: ChannelSort = { last_message_at: -1 };

const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
	const { channel, setActiveChannel, watchers } = props;

	const { channel: activeChannel } = useStreamChatContext();

	const selected = channel?.id === activeChannel?.id;

    console.log("test", channel);

	const renderMessageText = () => {
		const lastMessageText = channel.state.messages[channel.state.messages.length - 1]?.text ?? '';

		const text = lastMessageText ?? 'message text';

		return text.length < 60 ? lastMessageText : `${text.slice(0, 70)}...`;
	};

	// if (!channel.state.messages.length) return null;

	return (
		<div
			className={selected ? 'channel-preview__container selected' : 'channel-preview__container'}
			onClick={() => setActiveChannel?.(channel)}>
			<div className="channel-preview__content-wrapper">
				<div className="channel-preview__content-top">
					<p className="channel-preview__content-name">{channel.data?.name || 'Channel'}</p>
					<p className="channel-preview__content-name">{channel.data?.subtitle}</p>
				</div>
				<p className="channel-preview__content-message">{renderMessageText()}</p>
			</div>
		</div>
	);

	// const { channel, setActiveChannel } = props;

	// const { messages } = channel.state;
	// const messagePreview = messages[messages.length - 1]?.text.slice(0, 30);

	// return (
	// 	<div onClick={() => setActiveChannel(channel)} style={{ margin: '12px' }}>
	// 		<div>{channel.data.name || 'Unnamed Channel'}</div>
	// 		<div style={{ fontSize: '14px' }}>{messagePreview}</div>
	// 	</div>
	// );
};

const CustomMessage = () => {
	const { message } = useMessageContext();

	return (
		<div>
			<b style={{ marginRight: '4px' }}>{message.user?.name}</b> {message.text}
		</div>
	);
};

const CustomList = (props: PropsWithChildren<ChannelListMessengerProps>) => {
	const {
		children,
		error,
		loading,
		LoadingErrorIndicator = ChatDown,
		LoadingIndicator = LoadingChannels,
	} = props;

	if (error) {
		return (
			<LoadingErrorIndicator text="Loading Error - check your connection." type={'connection'} />
		);
	}

	if (loading) {
		return <LoadingIndicator />;
	}

	return <div>{children}</div>;
};

const CustomErrorIndicator = (props: ChatDownProps) => {
	const { text } = props;
	return <div>{text}</div>;
};

const CustomLoadingIndicator = () => {
	return <div>Loading, loading, loading...</div>;
};

const ChatHome: PageType = () => {
	const { client } = useChatContext();

	if (!client) {
		return <LoadingIndicator />;
	}

	return (
		<Chat client={client} theme="str-chat__theme-light">
			<ChannelList
				List={CustomList}
				filters={filters}
				sort={sort}
				Preview={CustomChannelPreview}
				LoadingErrorIndicator={CustomErrorIndicator}
				LoadingIndicator={CustomLoadingIndicator}
			/>
			<Channel>
				<Window>
					<ChannelHeader />
					<MessageList  />
					<MessageInput />
				</Window>
				<Thread />
			</Channel>
		</Chat>
	);
};

export default ChatHome;

ChatHome.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
