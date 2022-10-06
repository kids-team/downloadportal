import { useParams } from "react-router-dom";
import Card from '../components/Card';
import Navigation from '../components/Navigation';
import { Article } from '../services/models/article';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';

type TagResult = {
	root: Article;
	articles: Array<Article>;
}

const Tag = () => {

	const params = useParams();
	let tagName = params.tag;
	
	const args = {
		controller: 'pages',
		method: 'get_tag',
		tag: tagName,
	}
	
	const url = useUrl(args);
	const { data, error } = useFetch<TagResult>(url)
	  
	
	return (
		<>
		<Navigation />
		<header className="header" style={{paddingTop: '30vh'}}>
			<div className="content">
				<div className="header__title">
					<h1 className="font-script">{data?.root?.title}</h1>
					<h4 className="ml-4 xl:mr-0">Tag</h4>
				</div>
			</div>
		</header>
		<section className="bg-gray-100 py-12">
			<div className='content'>
				<div className='grid grid--columns-1 md:grid--columns-2 xl:grid--columns-3 grid--gap-12 mt-12'>
				{ data?.articles.map((article, index) => {
					return <Card 
					key={index}
						title={article.title}
						label={article.category}
						text={article.abstract}
						image={article.image?.src}
						link={article.id}
		
					/>
				}) }
				</div>
			</div>
		</section>
		
		</>
	)
}

export default Tag