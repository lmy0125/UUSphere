import React, { useState, createContext, useContext } from 'react';

interface ChatStackContextType {
	showChannel: boolean;
	setShowChannel: React.Dispatch<React.SetStateAction<boolean>>;
	showInfoSidebar: boolean;
	setShowInfoSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatStackContext = createContext<ChatStackContextType>({
	showChannel: false,
	setShowChannel: () => ({}),
	showInfoSidebar: false,
	setShowInfoSidebar: () => ({}),
});

export default function ChatStackContextProvider({ children }: { children: React.ReactNode }) {
	const [showChannel, setShowChannel] = useState(false);
	const [showInfoSidebar, setShowInfoSidebar] = useState(false);

	return (
		<ChatStackContext.Provider
			value={{
				showChannel,
				setShowChannel,
				showInfoSidebar,
				setShowInfoSidebar,
			}}>
			{children}
		</ChatStackContext.Provider>
	);
}

export const useChatStackContext = () => useContext(ChatStackContext);
