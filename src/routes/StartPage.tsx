import { ScrollRestoration, useParams } from "react-router-dom";
import Error from '../components/Error';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { Article } from '../services/models/article';
import Parser from '../services/parser';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';

const ArticlePage = () => {

	const { "*": id } = useParams();

	const args = {
		controller: 'page',
		id: id ? id : 'start',
	}

	const url = useUrl(args);
	const { data, error } = useFetch<Article>(url);

	const fileList = () => {
		if (!data?.files) return [];
		return data.files.filter((file) => (file.extension !== 'jpg' && file.extension !== 'jpeg'))
	}

	const availableFiles = fileList();
	console.log(data)

	const hasFiles = availableFiles.length > 0;
	const sideInfo = data?.showSubpages || hasFiles;
	const countFiles = availableFiles.length;



	return (
		<div>
			<Navigation />
			<ScrollRestoration />
			<Header aspectRatio='21' title={data?.title ?? ""} image={data?.pageimage} />

			<div className="py-12">
				{error && <Error message="No connection to server" />}
				{!data && <div className='loader'></div>}
				{data &&
					<div className="">
						<div className={sideInfo ? 'grid grid--columns-1 md:grid--columns-2 xl:grid--columns-3 grid--gap-12' : ''}>
							<div className={sideInfo ? 'grid__column grid__column--span-0 md:grid__column--span-0 xl:grid__column--span-2' : ''}><Parser content={data?.content} /></div>
							{sideInfo && <div>


							</div>}
						</div>
					</div>
				}
			</div>

			<section className='bg-gray-300 py-8 section--rounded'>

			</section>
		</div>
	)
}

export default ArticlePage