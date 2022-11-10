import { useContext } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import ArticleList from '../components/ArticleList';
import Error from '../components/Error';
import FileList from '../components/FileList';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getMediaUrl } from '../services/api';
import cleanId from '../services/cleanId';
import { Article } from '../services/models/article';
import Parser from '../services/parser';
import { store } from '../services/store';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';

const ArticlePage = () => {

	const { "*": id } = useParams();

	const { state: { taxonomies } } = useContext(store)

	const args = {
		controller: 'page',
		id: id ? cleanId(id) : 'start',
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


	const getTag = (tag: string) => {
		if (!taxonomies.tags.hasOwnProperty(tag)) return false
		return taxonomies.tags[tag]
	}

	const category = data?.category ? taxonomies.categories[data?.category] : false


	return (
		<div >
			<Navigation />
			<ScrollRestoration />
			{!hasFiles && <Header aspectRatio='21' title={data?.title ?? ""} image={data?.pageimage} />}
			{hasFiles && <Header title={data?.title ?? ""} minimal={true} />}
			<div className={sideInfo ? 'product article--side' : ''}>
				{error && <Error message="No connection to server" />}
				{!data && <div className='loader'></div>}
				{data && <>
					<div className="product__content">

						{hasFiles && <div className='image'>
							<img width="100%" src={getMediaUrl('/' + data?.pageimage, 1440)} />
						</div>}

						<div className={sideInfo ? ' product__description' : 'product__description'}><Parser content={data?.content} /></div>


					</div>
					{sideInfo && <aside>
						{hasFiles &&
							<FileList files={availableFiles} />
						}

						{data?.showSubpages &&
							<div className='card card--no-image'>
								<div className="card__content">
									<h4 className='card__title'><FormattedMessage id="moreArticles" defaultMessage="More Articles"></FormattedMessage></h4>
									<div className='card__text'>
										<ArticleList query="namespace" value={data.namespace} />
									</div>
								</div>
							</div>
						}

						<div className=''>
							{category &&
								<>
									{category.label}
								</>
							}
							{data.tags.length > 0 &&
								<div className='pills py-2'>
									<span><FormattedMessage id="tags" values={{ count: data.tags.length }} defaultMessage="{count, plural, =0 {no tags} one {Tag} other {Tags}}"></FormattedMessage></span>
									{data?.tags?.map((tag, index) => {
										const tagName = getTag(tag)
										if (!tagName) return;
										return <Link to={'/tag/' + tag} className='bg-gray-400 pills__item text-black' key={index}>{tagName.name}</Link>
									})}
								</div>}
							<div className="py-2"><b><FormattedMessage id="lastUpdated" defaultMessage="Last updated" /></b>: <FormattedDate value={new Date(data.date?.date.replace('-', '/'))} /></div>
							{data.copyright && <div className='py-2'><b><FormattedMessage id="copyright" defaultMessage="Copyright" /></b>: {data.copyright}</div>}

						</div>
					</aside>
					}
				</>}
			</div>


		</div>
	)
}

export default ArticlePage