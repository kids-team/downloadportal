import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import ArticleList from '../components/ArticleList';
import Error from '../components/Error';
import FileList from '../components/FileList';
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
		<>
			<Navigation />
			<ScrollRestoration />
			<Header title={data?.title ?? ""} image={data?.pageimage} />

			<section className="bg-gray-100 py-12">
				{error && <Error message="No connection to server" />}
				{!data && <div className='loader'></div>}
				{data &&
					<div className="content">
						<div className={sideInfo ? 'grid grid--columns-1 md:grid--columns-2 xl:grid--columns-3 grid--gap-12' : ''}>
							<div className={sideInfo ? 'grid__column grid__column--span-0 md:grid__column--span-0 xl:grid__column--span-2' : ''}><Parser content={data?.content} /></div>
							{sideInfo && <div>
								{hasFiles && <div>
									<div className='card card--first card--last card--image-top card--shadow card--white'>
										<div className='card__content'>
											<div className='card__header'><h2 className='card__title'><FormattedMessage id="downloads" defaultMessage="{count, plural, =0 {no downloads} one {Download} other {Downloads}}" values={{ count: countFiles }}></FormattedMessage></h2></div>
											<div className='card__text'><FileList files={availableFiles} /></div>
										</div>
									</div>
								</div>}
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
							</div>}
						</div>
					</div>
				}
			</section>
			<section className='bg-gray-300 py-8'>
				{data &&
					<div className='content'>
						<div className='pills'>
							<span><FormattedMessage id="tags" values={{ count: data.tags.length }} defaultMessage="{count, plural, =0 {no tags} one {Tag} other {Tags}}"></FormattedMessage></span>
							{data?.tags?.map((tag, index) => { return <Link to={'/tag/' + tag} className='bg-gray-800 pills__item pills__item--dark' key={index}>{tag}</Link> })}
						</div>
						<FormattedMessage id="lastUpdated" defaultMessage="Last updated" />: <FormattedDate value={new Date(data.date?.date)} />

					</div>
				}
			</section>
		</>
	)
}

export default ArticlePage