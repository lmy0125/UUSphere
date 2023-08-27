import { useSession } from 'next-auth/react';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@prisma/client';
import useUser from '@/hooks/useUser';

interface userContextType {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
	isLoading: boolean;
}

const UserContext = createContext<userContextType | undefined>(undefined);

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();
	const { data, error, isLoading } = useUser(session?.user.id ?? '');
	const [user, setUser] = useState<User>(data);

	useEffect(() => {
		setUser(data);
	}, [data]);

	return (
		<UserContext.Provider value={{ user, setUser, isLoading }}>{children}</UserContext.Provider>
	);
}

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context) {
		return { user: undefined, setUser: undefined, isLoading: true };
	}
	return context;
};
