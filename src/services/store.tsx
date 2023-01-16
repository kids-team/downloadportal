import React, { createContext, Dispatch, useReducer } from 'react';
import getCurrentLanguage from './getCurrentLanguage';
import { Audience, Category, Tag } from './models/article';
import { Bible, BibleAction } from './models/bible';
import { Menu, MenuAction } from './models/menu';
import { Organization, OrganizationAction } from './models/organization';

type InitialStateType = {
	menu: Menu;
	taxonomies: {
		tags: { [key: string]: Tag };
		categories: { [key: string]: Category };
		audience: { [key: string]: Audience };
	},
	bible: Bible;
	organizations: Organization[];
	footer: string;
	error: string;
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
	taxonomies: {
		categories: {},
		audience: {},
		tags: {},
	},
	footer: "",
	bible: {
		books: [],
		info: {}
	},
	organizations: [],
	status: 'init',
	error: '',
	lang: getCurrentLanguage()
}

type Action = MenuAction
	| BibleAction
	| OrganizationAction
	| { type: 'SET_LANG' | 'SET_ERROR' | 'SET_FOOTER' | 'SET_STATUS'; payload: string }
	| { type: 'SET_TAXONOMIES', payload: any }


type ProviderProps = {
	children: React.ReactNode; // 👈️ type children
};

const store = createContext<{
	state: InitialStateType;
	dispatch: Dispatch<Action>
}>({ state: initialState, dispatch: () => null });

const { Provider } = store;

const getState = (state: any) => {
	return state
}

const StateProvider: React.FC<ProviderProps> = (props) => {

	const reducer = (state: InitialStateType, action: Action) => {
		switch (action.type) {
			case 'SET_MENU':
				return { ...state, menu: action.payload }
			case 'SET_LANG':
				if (typeof action.payload != 'string') return { ...state, error: 'Language must be a string', status: 'error' };
				localStorage.setItem('dp_lang', action.payload ?? '')
				return { ...state, lang: action.payload }
			case 'SET_STATUS':
				return { ...state, status: action.payload }
			case 'SET_FOOTER':
				return { ...state, footer: action.payload }
			case 'SET_BIBLE':
				return { ...state, bible: action.payload }
			case 'SET_ORGANIZATION':
				return { ...state, organizations: action.payload }
			case 'SET_TAXONOMIES':
				return { ...state, taxonomies: action.payload }
			case 'SET_ERROR':
				return { ...state, error: action.payload }
			default:
				return state;
		};
	}

	const [state, dispatch] = useReducer(reducer, initialState);

	return (<Provider value={{ state, dispatch }} >{props.children}</Provider>);
};

export { store, StateProvider, getState };
