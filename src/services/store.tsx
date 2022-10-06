import React, { createContext, Dispatch, useReducer } from 'react';
import getCurrentLanguage from './getCurrentLanguage';
import { Bible, BibleAction } from './models/bible';
import { Menu, MenuAction } from './models/menu';

type InitialStateType = {
	menu: Menu;
	bible: Bible;
	footer: string;
	error: string;
	translation: {};
	lang: string;
	status: string;
};	

const initialState: InitialStateType = {
	menu: {
		items: [],
		claim: "",
		brand: "",
		available_langs: []
	},
	footer: "",
	translation: {},
	bible: {
		books: [],
		name: ""
	},
	status: 'init',
	error: '',
	lang: getCurrentLanguage()
}

type Action = MenuAction | BibleAction | { type: 'SET_LANG' | 'SET_ERROR' | 'SET_FOOTER' | 'SET_STATUS'; payload: string } | { type: 'SET_TRANSLATION', payload: {} }


type ProviderProps = {
	children: React.ReactNode; // 👈️ type children
};

const store = createContext<{
	state: InitialStateType;
	dispatch: Dispatch<Action>
}>({state: initialState, dispatch: () => null});

const { Provider } = store;

const StateProvider: React.FC<ProviderProps> = (props) => {

	const reducer = (state: InitialStateType, action: Action) => {
		switch(action.type) {
			case 'SET_MENU':
				return {...state, menu: action.payload}
			case 'SET_LANG':
				if(typeof action.payload != 'string') return {...state, error: 'Language must be a string', status: 'error'};
				localStorage.setItem('dp_lang', action.payload ?? '')
				return { ...state, lang: action.payload }
			case 'SET_STATUS': 
				return {...state, status: action.payload}
			case 'SET_FOOTER': 
				return {...state, footer: action.payload}
			case 'SET_TRANSLATION':
					return {...state, translation: action.payload}
			case 'SET_ERROR':
				return {...state, error: action.payload}
			default:
				return state;
		};
	}
	
	const [state, dispatch] = useReducer(reducer, initialState);
	
	return (<Provider value={{state, dispatch}} >{props.children}</Provider>);
};

export { store, StateProvider };
