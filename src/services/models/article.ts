import PhpDate from "./date";

export type Article = {
	id: string;
	tags: Array<string>;
	pageimage: string;
	image?: DokuFile;
	title: string;
	content: string;
	summary: string;
	link: string;
	exclude: string;
	category: string;
	icon: string
	template: string;
	pagelink: string;
	date: PhpDate;
	language: string
	abstract: string;
	showSubpages: boolean;
	namespace: string;
	files?: Array<DokuFile>;
	filter: Array<string>;
	user: string;
	minor_change: boolean;
}

export type DokuFile = {
	id: string;
	path: string;
	thumbnail: string;
	src: string;
	full: string;
	filename: string;
	size: number;
	modified: PhpDate;
	count: number;
	extension: string;
	info: string;
	writable: boolean
	minor_change: boolean;
}