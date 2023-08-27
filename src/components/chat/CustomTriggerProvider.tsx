import React from 'react';
import { MessageInputContextProvider, useMessageInputContext } from 'stream-chat-react';

const options = ['some', 'thing', 'that', 'totally', 'works'];

const CustomSuggestionItem = (props) => <div>{props.entity.name}</div>;

const customTrigger = {
	component: CustomSuggestionItem,
	dataProvider: (query, _, onReady) => {
		const filteredOptions = options
			.filter((option) => option.includes(query))
			.map((option) => ({ name: option }));
		onReady(filteredOptions, query);
	},
	output: (entity) => ({
		caretPosition: 'next',
		key: entity.name,
		text: entity.name,
	}),
};

const customTriggers = {
	'#': customTrigger,
};

const CustomTriggerProvider = ({ children }) => {
	const currentContextValue = useMessageInputContext();

	const updatedContextValue = {
		...currentContextValue,
		autocompleteTriggers: customTriggers,
	};

	return (
		<MessageInputContextProvider value={updatedContextValue}>
			{children}
		</MessageInputContextProvider>
	);
};

export default CustomTriggerProvider;
