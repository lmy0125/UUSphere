import { Avatar } from '@mui/material';
import { Channel, UserResponse } from 'stream-chat';
import {
	ChannelOrUserResponse,
	SearchResultItemProps,
	SearchResultsListProps,
} from 'stream-chat-react';

export const CustomDropdown = (props: SearchResultsListProps) => {
	const { results, focusedUser, selectResult, SearchResultItem } = props;

	let items: ChannelOrUserResponse[] = results.filter((x) => x.cid);
	let users: ChannelOrUserResponse[] = results.filter((x) => !x.cid);

	return (
		<div>
			<p>Channels</p>
			{!items.length && <p>No Channels...</p>}
			{SearchResultItem &&
				items.map((result, index) => (
					<SearchResultItem
						focusedUser={focusedUser}
						index={index}
						key={index}
						result={result}
						selectResult={selectResult}
					/>
				))}
			<p>Users</p>
			{!users.length && <p>No Users...</p>}
			{SearchResultItem &&
				users.map((result, index) => (
					<SearchResultItem
						focusedUser={focusedUser}
						index={index}
						key={index}
						result={result}
						selectResult={selectResult}
					/>
				))}
		</div>
	);
};

const isChannel = (output: Channel | UserResponse): output is Channel =>
	(output as Channel).cid != null;

export const CustomResultItem = (props: SearchResultItemProps) => {
	// const { focusedUser, index, result, selectResult } = props;

	// const focused = focusedUser === index;

	// if (isChannel(result)) {
	// 	const channel = result;
	// 	const { member_count } = channel?.data;

	// 	return (
	// 		<div
	// 			className={`str-chat__channel-search-result ${focused ? 'focused' : ''}`}
	// 			onClick={() => selectResult(result)}>
	// 			<div className="result-hashtag">#</div>
	// 			<p className="channel-search__result-text">
	// 				{channel?.data?.name}, ({member_count} member{member_count === 1 ? '' : 's'})
	// 			</p>
	// 		</div>
	// 	);
	// } else {
	// 	return (
	// 		<div
	// 			className={`str-chat__channel-search-result ${focused ? 'focused' : ''}`}
	// 			onClick={() => selectResult(result)}>
	// 			<Avatar src={result.image} />
	// 			{result.id}
	// 			{result.online && <p className="user-online"> Online Now!</p>}
	// 		</div>
	// 	);
	// }
};
