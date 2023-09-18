import React, { useState, SetStateAction, Dispatch, createContext, useContext } from 'react';

interface ChatContextType {
	composeMode: boolean;
	setComposeMode: Dispatch<SetStateAction<boolean>>;
}

const ComposeModeContext = createContext<ChatContextType>({
	composeMode: false,
	setComposeMode: () => ({}),
});

export default function ComposeModeContextProvider({ children }: { children: React.ReactNode }) {
	const [composeMode, setComposeMode] = useState(false);

	return (
		<ComposeModeContext.Provider
			value={{ composeMode: composeMode, setComposeMode: setComposeMode }}>
			{children}
		</ComposeModeContext.Provider>
	);
}

export const useComposeModeContext = () => useContext(ComposeModeContext);

export const ComposeModeContextConsumer = ComposeModeContext.Consumer;