import { useParams } from "react-router-dom";
import Card from '../components/Card';
import Header from "../components/Header";
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
			<Header
				title={data?.root.title}
				image={data?.root.pageimage}
			/>
			<section className="bg-gray-100 py-12">
				<div className='content'>
					<div className='grid grid--columns-1 md:grid--columns-2 xl:grid--columns-3 grid--gap-12 mt-12'>
						{data?.articles.map((article, index) => {
							return <Card
								key={index}
								title={article.title}
								label={article.category}
								text={article.abstract}
								image={article.pageimage}
								link={article.id}
							/>
						})}
					</div>
				</div>
			</section>

		</>
	)
}

export default Tag