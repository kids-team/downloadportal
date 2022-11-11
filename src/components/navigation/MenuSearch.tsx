import { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { getUrl } from '../../services/api';
import { store } from '../../services/store';

interface Props {
	setMenuOpen: (a: boolean) => void;
	setSearchOpen: (a: boolean) => void;
	searchOpen: Boolean;
	className: string;
	intl: IntlShape
}

interface Result {
	abstract: string,
	id: string,
	title: string,
	type: string
}

type Response = {
	result: Array<Result>
	more: boolean
}

const MenuSearch = (props: Props) => {
	const { state } = useContext(store);
	const { setMenuOpen, searchOpen, setSearchOpen, className } = props

	const [query, setQuery] = useState('');
	const [response, setResponse] = useState<Response>({
		result: [],
		more: false
	});
	const [selectedSearchItem, setSelectedSearchItem] = useState(-1);

	const navigate = useNavigate();

	const inputField = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setQuery('');
		setResponse({ result: [], more: false });
		if (!searchOpen) return;
		if (null !== inputField.current) {
			inputField?.current.focus();
		}

	}, [searchOpen])

	const performSearch = (value: string) => {
		setQuery(value);
		if (!value) return;
		if (value.length < 3) {
			setResponse({ result: [], more: false });
			return;
		}
		fetch(getUrl('', {
			controller: 'search',
			method: 'fast',
			q: value,
			lang: state.lang
		})).then((res) => res.json()).then((data) => {
			setResponse(data)
		}).catch((error) => {
			console.log(error)
		})
	}


	const inputKeyDown = (event: any) => {
		console.log(event.key)
		if (event.key == "Enter" && selectedSearchItem == -1) {
			gotoSearchPage();
			return;
		}
		if (event.key == "Enter") {
			const currentItem = response?.result[selectedSearchItem]
			navigate('/' + currentItem.id)
			setSearchOpen(false);
			return;
		}
		if (event.key == "ArrowDown" && selectedSearchItem < response.result.length) {
			setSelectedSearchItem(selectedSearchItem + 1)
		}
		if (event.key == "ArrowUp" && selectedSearchItem != -1) {
			setSelectedSearchItem(selectedSearchItem - 1)
		}
		if (event.key == "Escape") {
			setSelectedSearchItem(selectedSearchItem - 1)
			setSearchOpen(false)
		}


	}


	const gotoSearchPage = () => {
		setQuery('')
		setSearchOpen(false);
		navigate('/search/' + query)
	}

	const openSearchResult = (link: string) => {
		setQuery('')
		navigate(link)
	}

	const backdropClicked = (event: MouseEvent) => {
		if (event.target === null) return;
		if (event.currentTarget.tagName === 'DIV') {
			setSearchOpen(false);
		}
	}


	return (<>
		<div className={"search " + className + (searchOpen ? ' search--open' : '')}  >
			<button onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }} type="button" className={'search__button ' + (searchOpen ? 'active' : '')}>
				{!searchOpen && <i className='material-icons'>search</i>}
				{searchOpen && <i className='material-icons'>close</i>}
			</button>
			{searchOpen && <div className='search__form'>
				<div className="search__input">
					<input
						type="search"
						ref={inputField}
						placeholder="Suche"
						value={query}
						onChange={(event) => { performSearch(event.target.value) }}
						onKeyDown={(event) => { inputKeyDown(event) }}
					/>
					<span className="search__send" onClick={() => { gotoSearchPage() }}><i className='material-icons'>search</i></span>
				</div>
				<div className={'search__results ' + (searchOpen ? 'search__results--visible' : '')} onClick={(event) => { backdropClicked(event) }}>
					<ul className='list list--padded'>
						{response.more && <li className='list__item'><FormattedMessage defaultMessage="Hit Enter for more results" id="hitEnter" /></li>}
						{response.result?.map((item: Result, index) => {
							return <a key={index} onClick={() => { openSearchResult(item.id) }} className={'list__item ' + (selectedSearchItem == index ? 'list__item--active' : '')}>
								<span >{item.title}<br /><sub className='list__subtitle'>{item.abstract}</sub></span>
							</a>
						})}
					</ul>
				</div>
			</div>}
		</div>

	</>
	)
}

export default injectIntl(MenuSearch)