import parse, { attributesToProps, domToReact } from 'html-react-parser';
import { Link } from 'react-router-dom';
import ArticleCards from '../components/ArticleCards';
import ArticleList from '../components/ArticleList';
import BibleVerse from '../components/bibleVerse';
import settings from '../settings.json';

interface Props {
	content: string
}

const Parser = (props: Props) => {

	let replacedText;

	const { content } = props;

	if (content === undefined) return <></>

	replacedText = content.replaceAll(/(={2,6}.+?={2,6})/g, (match) => {

		const count = match.split(' ')[0].length
		let result;
		let title = match.replaceAll(/={2,}/g, '');
		switch (count) {
			case 2:
				result = `<h5>${title}</h5>`
				break;
			case 3:
				result = `<h4>${title}</h4>`
				break;
			case 4:
				result = `<h3>${title}</h3>`
				break;
			case 5:
				result = `<h2>${title}</h2>`
				break;
			case 6:
				result = `<h1>${title}</h1>`
				break;
			default:
				result = `<h5>${title}</h5>`

		}
		return result
	});

	replacedText = replacedText.replaceAll(/\[{2}.*\]{2}/g, (match, index) => {
		match = match.replaceAll(/\[/g, '').replaceAll(/\]/g, '')
		const title = match.includes('|') ? match.split('|')[1] : match;
		const href = match.includes('|') ? match.split('|')[0] : match;
		const regex = /(www|http|mailto)/g
		const id = regex.test(href) ? '' : `id=${href}`
		return `<a href=${href} ${id}>${title}</a>`
	})

	replacedText = replacedText.replaceAll(/((?<!\:)\/{2}[\s\S]*?\/{2})/g, (match) => {
		let title = match.replaceAll(/\/{2,}/g, '');
		return (
			`<i>${title}</i>`
		)
	});

	replacedText = replacedText.replaceAll(/(\{{2}youtube>.+\}{2})/g, (match) => {
		const data = match.slice(10).slice(0, -2);
		const [url, size] = data.includes('?') ? data.split('?') : [data, '']
		return (
			`<iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" width="100%" style="aspect-ratio: 16/9;" type="text/html" src="https://www.youtube.com/embed/${url}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0"></iframe>`
		)
	});


	replacedText = replacedText.replaceAll(/(\{{2}[\s\S]*?\}{2})/g, (match) => {
		const data = match.replaceAll(/[{}]{2,}/g, '');
		const [media, alt] = data.includes('|') ? data.split('|') : [data, '']
		const [id, width] = media.includes('?') ? media.split('?') : [media, 0]
		const url = `${settings.api}/_media${id.replaceAll(':', '/')}${width > 0 ? `?w=${width}` : ''}`
		return (
			`<img src="${url}" alt="${alt}"/>`
		)
	});
	replacedText = replacedText.replaceAll(/(\*{2}[\s\S]*?\*{2})/g, (match) => {
		let title = match.replaceAll(/\*{2,}/g, '');
		return (
			`<b>${title}</b>`
		)
	});

	replacedText = replacedText.replaceAll(/(__[\s\S]*?__)/g, (match) => {
		let title = match.replaceAll(/_{2,}/g, '');
		return (
			`<u>${title}</u>`
		)
	});

	replacedText = replacedText.replaceAll(/(\\{2})/g, (match, i) => {
		return (
			`<br />`
		)
	}
	);

	replacedText = replacedText.replaceAll(/(-{4})/g, (match, i) => {
		return (
			`<hr />`
		)
	}
	);

	replacedText = replacedText.replaceAll(/^[|^](.+\n)+\|(.+)[|^]$/gm, (match) => {
		const lines = match.split('\n')
		let result = '<table>'
		lines.map(line => {
			const start = line[0] === "|" ? '<tr><td>' : '<th><td>'
			const end = line[0] === "|" ? '</td><tr>' : '</td><th>'
			result += start + line.substring(1).slice(0, -1).replaceAll(/\|/g, '</td><td>') + end;
		});
		result += '</table>';
		return result
	})

	replacedText = replacedText.replaceAll(/((([ ]{2,})([*-])[ ].+\n?)+)/gi, (match) => {
		const list = match.split(/\n/g)
		const regExp = new RegExp(/[ ]{2,}\*/)
		const tag = regExp.test(list[0]) ? 'ul' : 'ol'
		let result = '';
		list.map((element) => {
			if (element === '') return;
			let title = element.replaceAll(/[ ]{2,}[*-][ ]/g, '');
			result += `<li>${title}</li>`
		})

		return (
			`<${tag} class="core-block">${result}</${tag}>`
		)
	}
	);

	let result = parse(replacedText, {
		replace: (domNode: any) => {

			if (domNode.attribs && domNode.name === 'bible') {
				const props = attributesToProps(domNode.attribs);
				return <BibleVerse verse={domNode.attribs.verse}>{domToReact(domNode.children)}</BibleVerse>
			}

			if (domNode.attribs?.id && domNode.name === 'a') {
				const props = attributesToProps(domNode.attribs);
				return <Link to={(domNode.attribs.id)}>{domToReact(domNode.children)}</Link>
			}

			if (domNode.attribs && domNode.name === 'subpages') {
				const attribute = ['tag', 'namespace', 'id'].filter(value => value in domNode.attribs)
				const style = domNode.attribs.style ?? "cards";
				if (attribute.length !== 1) return <></>;
				const query = attribute[0];
				let props = {
					query,
					columns: domNode.attribs.columns ?? 3,
					value: domNode.attribs[query]
				};

				if (style === "cards") return <ArticleCards {...props} />
				return <ArticleList {...props} />
			}

			if (domNode.attribs && domNode.name === 'wrap') {
				const props = attributesToProps(domNode.attribs);
				return <div {...props}>{domToReact(domNode.children)}</div>
			}
		}
	})

	return <>{result}</>


}

export default Parser