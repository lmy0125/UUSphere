import React, { useState, createContext, useContext } from 'react';

interface ChatMobileContextType {
	showChannel: boolean;
	setShowChannel: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatMobileContext = createContext<ChatMobileContextType>({
	showChannel: false,
	setShowChannel: () => ({}),
});

export default function ChatMobileContextProvider({ children }: { children: React.ReactNode }) {
	const [showChannel, setShowChannel] = useState(false);

	return (
		<ChatMobileContext.Provider
			value={{
				showChannel,
				setShowChannel,
			}}>
			{children}
		</ChatMobileContext.Provider>
	);
}

export const useChatMobileContext = () => useContext(ChatMobileContext);
