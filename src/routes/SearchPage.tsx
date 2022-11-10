import parse from 'html-react-parser';
import { useContext, useState } from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Link, useParams } from "react-router-dom";
import Combobox from '../components/Combobox';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getLink, getUrl } from '../services/api';
import { Article } from '../services/models/article';
import { store } from '../services/store';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';

type SearchResult = {
	items: Array<Article>;
	categories: Array<string>;
	audience: Array<string>;
	didyoumean: string;
	tags: Array<string>;
}

type Filter = {
	tags: Array<string>,
	audience: Array<string>,
	category: string | number
}

const emptyFilter: Filter = {
	tags: [],
	audience: [],
	category: ''
}

interface SearchPageProps {
	intl: IntlShape
}

const SearchPage = ({ intl }: SearchPageProps) => {

	const params = useParams();
	const queryParam = Object.values(params)[0]

	const { state } = useContext(store)
	const [query, setQuery] = useState(queryParam)
	const [queryField, setQueryField] = useState(queryParam)
	const [fuzzy, setFuzzy] = useState(true)
	const [showFilter, setShowFilter] = useState(false)

	const [filterSettings, setFilterSettings] = useState<Filter>(emptyFilter)

	const args = {
		controller: 'search',
		q: query,
		fuzzy: fuzzy ? 1 : 0
	}

	const url = useUrl(args)
	const { data, error } = useFetch<SearchResult>(url)

	const spellingError = () => {
		if (!data) return false;
		if (data?.didyoumean === '') return false;
		return data?.didyoumean !== query?.toLowerCase()
	}

	const availableTags = () => {
		if (!data?.tags) return []
		let tags = data?.tags.filter(tag => tag in state.taxonomies.tags)
		return tags.map(item => {
			return state.taxonomies.tags[item]
		});
	}

	const availableCategories = () => {
		if (!data?.categories) return []
		let categories = data?.categories.filter(cat => cat in state.taxonomies.categories);
		return categories.map(item => {
			return state.taxonomies.categories[item]
		});
	}

	const availableAudiences = () => {
		if (!data?.audience) return []
		let filteredAudience = data?.audience.filter(aud => aud in state.taxonomies.audience);
		console.log(filteredAudience)
		return filteredAudience.map(item => {
			return state.taxonomies.audience[item]
		});
	}

	const filteredResult = () => {
		if (!data) return [];
		let filteredItems = data.items;
		if (filterSettings.category !== '') {
			filteredItems = filteredItems.filter(item => {
				return item.category === filterSettings.category
			})
		}
		if (filterSettings.tags.length !== 0) {
			filteredItems = filteredItems.filter(item => {
				return item.tags.some(tag => filterSettings.tags.includes(tag))
			})
		}

		if (filterSettings.audience.length !== 0) {
			filteredItems = filteredItems.filter(item => {
				return filterSettings.audience.includes(item.audience)
			})
		}
		return filteredItems
	}

	const changeSearch = (event: any) => {
		setQueryField(event.currentTarget?.value)
		setFuzzy(true);
		setFilterSettings(emptyFilter)
		if (event.key !== 'Enter') return;
		setQuery(event.target.value);
	}

	const toggleTagFilterItem = (tagId: string) => {
		if (filterSettings.tags.includes(tagId)) {
			setFilterSettings(filter => { return { ...filter, tags: filterSettings.tags.filter(tag => tag !== tagId) } })
			return;
		}

		setFilterSettings(filter => { return { ...filter, tags: [...filterSettings.tags, tagId] } })
	}

	const toggleAudienceFilterItem = (value: string) => {
		if (filterSettings.audience.includes(value)) {
			setFilterSettings(filter => { return { ...filter, audience: filterSettings.audience.filter(tag => tag !== value) } })
			return;
		}

		setFilterSettings(filter => { return { ...filter, audience: [...filterSettings.audience, value] } })
	}

	// we sould use Memoization here
	const audienceAvailable = availableAudiences();
	const categoriesAvailable = availableCategories();
	const tagsAvailable = availableTags();

	const filterAvailable = categoriesAvailable.length > 0
		&& tagsAvailable.length > 0
		&& audienceAvailable.length > 0
		&& data?.items.length !== 0

	return (
		<>
			<Navigation />
			<Header aspectRatio='21' title={intl.formatMessage({ defaultMessage: 'Search', id: 'search' })} subtitle={query} />

			<section className='bg-gray-200 py-12 mt-4 lg:mb-4'>
				<div className='flex gap-4'>
					<button onClick={() => { setShowFilter(!showFilter) }} className='button button--primary xl:hidden'><i className='material-icons'>tune</i></button>
					<div className='input input--large'><label><FormattedMessage defaultMessage="Search" id="search" /></label><input value={queryField} type="text" onChange={(event) => setQueryField(event.target.value)} onKeyDown={(event) => changeSearch(event)} /></div>
				</div>
			</section>

			<div className="lg:grid lg:grid--columns-4 grid--gap-4">
				<div className={'lg:show ' + (showFilter ? '' : 'hidden')}>



					{true && <div className={showFilter ? 'bg-gray-100 p-4' : 'bg-gray-200 p-4'}>
						<p className='flex flex-center'><i className="material-icons mr-2">tune</i><FormattedMessage defaultMessage="Filter" id="filter" /></p>
						{categoriesAvailable.length !== 0 && <>
							<p className='uppercase bold text-gray-700'><FormattedMessage id="category" defaultMessage="Category" /></p>
							<div className='pills'>
								<Combobox
									className="w-full"
									nullOption={intl.formatMessage({ defaultMessage: 'No category', id: 'noCategory' })}
									options={availableCategories()}
									onChange={result => setFilterSettings(filter => { return { ...filter, category: result } })}
									placeholder={intl.formatMessage({ defaultMessage: 'Select Category', id: 'selectCategory' })}
								/>
							</div></>
						}

						{tagsAvailable.length !== 0 && <>
							<p className='uppercase bold text-gray-700'><FormattedMessage id="tags" defaultMessage="Tags" values={{ count: tagsAvailable.length }} /></p>
							<div className='pills '>
								{availableTags().map((tag, index) => {
									if (tag == null) return;
									return <li className={"pills__item link " + (filterSettings.tags.includes(tag?.id) ? 'pills__item--primary' : '')} key={index} onClick={() => { toggleTagFilterItem(tag.id) }}>{tag.name}</li>
								})}
							</div> </>}

						{audienceAvailable.length !== 0 && <>
							<p className='uppercase bold text-gray-700'><FormattedMessage id="audience" defaultMessage="Audience" /></p>
							<div>{availableAudiences().map((audience, index) => {
								return <div className="checkbox" key={index}>
									<label><input type="checkbox" onChange={() => toggleAudienceFilterItem(audience.value)} checked={filterSettings.audience.includes(audience.value)} />
										<span>{audience.label}</span>
									</label>
								</div>
							})}
							</div>
						</>}

					</div>}
				</div>
				<div className="xl:grid__column--span-3">
					{spellingError() && fuzzy && <div className="alert alert--warning">
						<div className='content'>
							<FormattedMessage
								id="didYouMean"
								defaultMessage="Search results for {didyoumean}. Search for {alt} instead."
								values={
									{
										didyoumean: <b>{data?.didyoumean}</b>,
										alt: <a onClick={() => { setFuzzy(false) }}>{query}</a>
									}
								}
							/>
						</div>
					</div>}
					<div className='list'>
						{filteredResult().length == 0 && <p><FormattedMessage id="noResults" defaultMessage="No search results" /></p>}
						{filteredResult().map((item, index) => {
							return <Link className='list__item' key={index} to={getLink(item.id)}>
								{item.pageimage && <img className='list__image list__image--edgy' src={getUrl('_media/' + item.pageimage, { w: "200", lang: state.lang })} />}
								{!item.pageimage && <div className='list__icon'>
									<i className='material-icons'>{item.icon}</i>
								</div>}
								<div className='list__content'>
									<span className='list__title'>{item.title}</span>
									<span className='list__description'>{parse(item.abstract)}</span>
								</div>
							</Link>
						})}
					</div>
				</div>
			</div>

		</>
	)
}

export default injectIntl(SearchPage) 