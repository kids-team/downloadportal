import { useContext } from 'react';
import { getUrl } from '../services/api';
import { Article } from '../services/models/article';
import { store } from '../services/store';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';

type Props = {
	query: string;
	value: string;
	columns: number;
}

const ArticleList = (props: Props) => {

	const { state } = useContext(store)
	const { query, value, columns = 3 } = props;

	const args = {
		controller: 'pages',
		query,
		value,
		lang: state.lang
	}

	const url = useUrl(args)
	const { data, error } = useFetch<Array<Article>>(url);

	return (
		<>
		{ !data && !error && <div className={`grid grid--columns-${columns} grid--gap-12`}>{[...Array(6)].map((page, index) => {
			return(<li className='list__item'
			key={index}
		>
			<img className='list__image'  /> 
			
		</li>)
		}) }</div> }
		<div className={`list`}>{ data?.map((page: Article, index: any) => {
			return (
				<li className='list__item'
					key={index}
				>
					{ page.pageimage && <img className='list__image' src={getUrl(page.pageimage, {w: 300})} />  }
					{ !page.pageimage && page.icon && <div className='list__icon'><i className='material-icons'>{page.icon}</i></div>}
					{page.title}
				</li>
				
			)
		}) }</div>
		</>
	)
}

ArticleList.defaultProps = {
	columns: 3,
};


export default ArticleList