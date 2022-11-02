import { useContext, useState } from 'react';
import { store } from '../services/store';

type Props = {
	show: boolean,
	available: {
		categories: Array<string>;
		audience: Array<string>;
		tags: Array<string>;
	}
}

type Filter = {
	tags: Array<string>,
	audience: Array<string>,
	category: string | number
}

const PageFilter = (props: Props) => {

	const { state } = useContext(store)
	const { available } = props

	const [showFilter, setShowFilter] = useState(false)

	const [filterSettings, setFilterSettings] = useState<Filter>({
		tags: [],
		audience: [],
		category: ''
	})

	const availableTags = () => {
		if (!available?.tags) return []
		let tags = available?.tags.filter(tag => tag in state.taxonomies.tags)
		return tags.map(item => {
			return state.taxonomies.tags[item]
		});
	}

	const availableCategories = () => {
		if (!available?.categories) return []
		let categories = available?.categories.filter(cat => cat in state.taxonomies.categories);
		return categories.map(item => {
			return state.taxonomies.categories[item]
		});
	}

	const availableAudiences = () => {
		if (!available?.audience) return []
		let filteredAudience = available?.audience.filter(aud => aud in state.taxonomies.audience);
		console.log(filteredAudience)
		return filteredAudience.map(item => {
			return state.taxonomies.audience[item]
		});
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

	return (
		<div>Filter</div>
	)
}

export default PageFilter