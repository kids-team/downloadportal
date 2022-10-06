export type Bible = {
	name: string;
	books: Array<Book>
}

export type Book = {
	id: number;
	lang: string;
	short_name: string;
	long_name: string;
	section: string;
	order: number;
	chapters: number;
	testament: 'ot' | 'nt';
	translation: string;
} 

export type Verse = {
	book: number;
	text: string;
	chapter: number;
	verse: number;
	linebreak: number;
}

export type BibleAction = { type: 'SET_BIBLE', payload: Bible}

const bibleReducer = (state: Bible, action: BibleAction) => {
	switch(action.type) {
		case 'SET_BIBLE':
			return {...state, 
				books: action.payload.books,
				name: action.payload.name
			}
		default:
			return state;
	};
}

export default bibleReducer;