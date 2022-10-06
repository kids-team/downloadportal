export type LanguageAction = { type: 'SET_LANG', payload: string}

const languageReducer = (state: string, action: LanguageAction) => {
	switch(action.type) {
		case 'SET_LANG':
			localStorage.setItem('dp_lang', action.payload)
			state = action.payload;
			return state;
		default:
			return state;
	};
}

export default languageReducer;