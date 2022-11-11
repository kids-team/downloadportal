import { ScrollRestoration, useParams } from "react-router-dom";
import Header from '../components/common/Header';
import Error from '../components/Error';
import Navigation from '../components/navigation/Navigation';
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
						<div className="">
							<div className={""}><Parser content={data?.content} /></div>
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