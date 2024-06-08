// import React, { createContext, useContext, useReducer } from 'react';

// type DrawerComponent = React.ComponentType;

// interface DrawerStackState {
// 	stack: DrawerComponent[];
// }

// interface DrawerAction {
// 	type: string;
// 	payload?: DrawerComponent;
// }

// interface DrawerStackContextType {
// 	state: DrawerStackState;
// 	dispatch: React.Dispatch<DrawerAction>;
// }

// const DrawerStackContext = createContext<DrawerStackContextType | undefined>(undefined);

// const DRAWER_ACTIONS = { PUSH: 'push', POP: 'pop', REPLACE: 'replace' };

// const DrawerStackContextProvider = ({ children }: { children: React.ReactNode }) => {
// 	const initialState: DrawerStackState = {
// 		stack: [],
// 	};
// 	const reducer = (state: DrawerStackState, action: DrawerAction) => {
// 		switch (action.type) {
// 			case DRAWER_ACTIONS.PUSH:
// 				return { stack: [...state.stack, action.payload] } as DrawerStackState;
// 			case DRAWER_ACTIONS.POP:
// 				return { stack: state.stack.slice(0, -1) } as DrawerStackState;
// 			case DRAWER_ACTIONS.REPLACE:
// 				return { stack: [...state.stack.slice(0, -1), action.payload] } as DrawerStackState;
// 			default:
// 				return state;
// 		}
// 	};

// 	const [state, dispatch] = useReducer(reducer, initialState);

// 	return (
// 		<DrawerStackContext.Provider value={{ state, dispatch }}>
// 			{children}
// 		</DrawerStackContext.Provider>
// 	);
// };

// const useDrawerStackContext = () => {
// 	const context = useContext(DrawerStackContext);
// 	if (!context) {
// 		throw new Error('useNavigation must be used within a NavigationProvider');
// 	}
// 	return context;
// };

// export { DRAWER_ACTIONS, DrawerStackContextProvider, useDrawerStackContext };
