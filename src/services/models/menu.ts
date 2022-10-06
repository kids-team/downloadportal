export type Menu = {
	brand: string;
	claim: string;
	available_langs: Array<string>;
	items: Array<MenuItem>;
}

export type MenuItem = {
	link: string;
	open: boolean;
	title: string;
	children: Array<MenuItem>;
}

export type MenuAction = { type: 'SET_MENU', payload: Menu}

const menuReducer = (state: Menu, action: MenuAction) => {
	switch(action.type) {
		case 'SET_MENU':
			return {...state, 
				items: action.payload.items,
				brand: action.payload.brand,
				claim: action.payload.claim
			}
		default:
			return state;
	};
}

export default menuReducer;