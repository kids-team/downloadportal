import { BibleRef } from "./bible";
import PhpDate from "./date";

export type Article = {
	id: string;
	title: string;
	content: string;
	abstract: string;
	namespace: string;

	minor_change: boolean;
	user: string;
	date: PhpDate;
	created: PhpDate;

	category: string;
	audience: string;
	tags: Array<string>;
	bibleref: Array<BibleRef>;

	icon: string;
	files: Array<DokuFile>;
	pagelink: string;
	pageimage: string;
	copyright: string;

	showSubpages: boolean;
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

export type Tag = {
	name: string,
	id: string
}

export type Category = {
	value: string
	label: string
	icon: string,
	color: string
}

export type Audience = {
	value: string
	label: string
}