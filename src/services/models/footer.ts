export type FooterAction = { type: 'SET_FOOTER', payload: string}

const footerReducer = (state: string, action: FooterAction) => {
	switch(action.type) {
		case 'SET_FOOTER':
			state = action.payload;
			return state;
		default:
			return state;
	};
}

export default footerReducer;