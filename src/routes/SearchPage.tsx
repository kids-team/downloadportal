import parse from 'html-react-parser';
import { useContext, useState } from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Link, useParams } from "react-router-dom";
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getLink, getUrl } from '../services/api';
import { store } from '../services/store';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';

type SearchResult = {
	items: Array<{
		id: string;
		title: string;
		abstract: string;
		icon: string;
		pageimage: string; 
		category: string;
		tags: Array<string>;
	}>
	categories: Array<string>;
	didyoumean: string;
}

interface SearchPageProps {
	intl: IntlShape
}

const SearchPage = ({ intl }: SearchPageProps) => {
	
	const params = useParams();
	const queryParam = Object.values(params)[0]

	const { state } = useContext(store)
	const [ query, setQuery ] = useState(queryParam)
	const [ queryField, setQueryField ] = useState(queryParam)
	const [ fuzzy, setFuzzy ] = useState(true)

	const [ category, setCategory ] = useState('')

	const args = {
		controller: 'search',
		q: query,
		fuzzy: fuzzy ? 1 : 0
	}

	const url = useUrl(args)
	const {data, error} = useFetch<SearchResult>(url)

	const spellingError = () => {
		if(!data) return false;
		if(data?.didyoumean == '') return false;
		return data?.didyoumean != query?.toLowerCase()
	}

	console.log("did you mean: ", data?.didyoumean)

	const filteredResult = () => {
		if(!data) return [];
		if(category === '') return data.items;
		return data.items.filter(item => {
			return item.category == category
		})
	}

	const changeSearch = (event: any) => {
		setQueryField(event.currentTarget?.value)
		setFuzzy(true);
		if(event.key !== 'Enter') return;
		setQuery(event.target.value);
	}

	return (
		<>
		<Navigation />
		<Header height={10} title={intl.formatMessage({defaultMessage:'Search', id:'search'})} subtitle={query}/>
		
		<section className='bg-gray-200 py-12'>
			<div className='content'>
				<div className='input input--large mb-12'><label><FormattedMessage defaultMessage="Search" id="search"/></label><input value={queryField} type="text" onChange={(event) => setQueryField(event.target.value)} onKeyDown={(event) => changeSearch(event)}/></div>
				
				{ filteredResult().length != 0 && data?.categories != undefined && data?.categories?.length > 1 && <>
					<p><FormattedMessage id="selectCategory" defaultMessage="Select a category" /></p>
					<div className='pills '>
						<li onClick={() => {setCategory('')}} className={"pills__item " + (category === '' ? 'pills__item--primary' : '')}><FormattedMessage id="all" defaultMessage="All" /></li>
						{ data?.categories.map((cat, index) => {
							return <li className={"pills__item " + (cat == category ? 'pills__item--primary' : '')} key={index} onClick={() => {setCategory(cat)}}>{cat}</li>
						}) }
					</div>
				</> }
			</div>
		</section> 
		
		<section className="bg-gray-100 py-12">
			
			<div className="content">
				{  spellingError() && fuzzy && <div className="alert alert--warning">
					<div className='content'>
						<FormattedMessage
							id="didYouMean"
							defaultMessage="Search results for {didyoumean}. Search for {alt} instead."
							values={
								{
									didyoumean: <b>{data?.didyoumean}</b>,
									alt: <a onClick={() => {setFuzzy(false)}}>{query}</a>
								}
							}
						/>
					</div>
				</div> }
				<div className='list'>
					{ filteredResult().length == 0 && <p><FormattedMessage id="noResults" defaultMessage="No search results" /></p>}
					{ filteredResult().map((item, index) => {
					return <Link className='list__item' to={getLink(item.id)}>
						{ item.pageimage && <img className='list__image list__image--edgy' src={getUrl('_media/' + item.pageimage, {w: "200", lang: state.lang})}/> }
						{ !item.pageimage && <div className='list__icon'>
							<i className='material-icons'>{item.icon}</i>	
						</div>}
						<div className='list__content'>
							<span className='list__title'>{item.title}</span>
							<span className='list__description'>{parse(item.abstract)}</span>
						</div>
					</Link>
				}) }
				</div>
			</div>
		</section>
		<Footer />
		</>
	)
}

export default injectIntl(SearchPage)