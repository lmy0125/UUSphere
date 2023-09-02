import { ClassInfo } from '@/types/class';
import React, { Dispatch, createContext, useContext, useState } from 'react';

interface ClassEnrollmentContextType {
	sectionJoined: string;
	setSectionJoined: Dispatch<React.SetStateAction<string>>;
	sectionDropped: string;
	setSectionDropped: Dispatch<React.SetStateAction<string>>;
	classInfoJoined: ClassInfo | undefined;
	setClassInfoJoined: Dispatch<React.SetStateAction<ClassInfo | undefined>>;
	classInfoDropped: ClassInfo | undefined;
	setClassInfoDropped: Dispatch<React.SetStateAction<ClassInfo | undefined>>;
}

const ClassEnrollmentContext = createContext<ClassEnrollmentContextType | undefined>(undefined);

export const ClassEnrollmentContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [sectionJoined, setSectionJoined] = useState('');
	const [sectionDropped, setSectionDropped] = useState('');
	const [classInfoJoined, setClassInfoJoined] = useState<ClassInfo | undefined>(undefined);
	const [classInfoDropped, setClassInfoDropped] = useState<ClassInfo | undefined>(undefined);

	return (
		<ClassEnrollmentContext.Provider
			value={{
				sectionJoined,
				setSectionJoined,
				sectionDropped,
				setSectionDropped,
				classInfoJoined,
				setClassInfoJoined,
				classInfoDropped,
				setClassInfoDropped,
			}}>
			{children}
		</ClassEnrollmentContext.Provider>
	);
};

export const useClassEnrollmentContext = (): ClassEnrollmentContextType => {
	const context = useContext(ClassEnrollmentContext);
	if (context === undefined) {
		throw new Error('useMyContext must be used within a MyContextProvider');
	}
	return context;
};
