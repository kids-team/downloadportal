export type Bible = {
	info: {
		description?: string,
		chapter_string?: string,
		chapter_string_ps?: string,
		detailed_info?: string,
		author?: string,
		url?: string
	};
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

export type BibleAction = { type: 'SET_BIBLE', payload: Bible }
