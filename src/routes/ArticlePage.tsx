import { useContext } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link, ScrollRestoration, useParams } from 'react-router-dom';
import ArticleList from '../components/ArticleList';
import Header from '../components/common/Header';
import ShareButtons from '../components/common/ShareButtons';
import Error from '../components/Error';
import FileList from '../components/FileList';
import Navigation from '../components/navigation/Navigation';
import { getMediaUrl } from '../services/api';
import cleanId from '../services/cleanId';
import { Article } from '../services/models/article';
import Parser from '../services/parser';
import { store } from '../services/store';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';

const ArticlePage = () => {
    const { '*': id } = useParams();

    const {
        state: { taxonomies },
    } = useContext(store);

    const args = {
        controller: 'page',
        id: id ? cleanId(id) : 'start',
    };

    const url = useUrl(args);
    const { data, error } = useFetch<Article>(url);

    const fileList = () => {
        if (!data?.files) return [];
        return data.files.filter(file => file.extension !== 'jpg' && file.extension !== 'jpeg');
    };

    document.title = data?.title ?? '';
	console.log(data?.tags)
    const availableFiles = fileList();

    const hasFiles = availableFiles.length > 0;
    const sideInfo = data?.showSubpages || hasFiles;

    const getTag = (tag: string) => {
        if (!taxonomies.tags.hasOwnProperty(tag)) return false;
        return taxonomies.tags[tag];
    };

    const category = data?.category ? taxonomies.categories[data?.category] : false;
    const audience = data?.audience ? taxonomies.audience[data?.audience] : false;

	const tagList = <>{data?.tags?.map((tag, index) => {
		const tagName = getTag(tag);
		if (!tagName) return;
		return (
			<Link
				to={'/tag/' + tag}
				className="bg-gray-400 pills__item text-black"
				key={index}
			>
				{tagName.name}
			</Link>
		);
	})}</>

	

    return (
        <div>
            <meta property="og:title" content={data?.title ?? ''} />
            <meta property="og:description" content={data?.abstract ?? ''} />
            <meta property="og:image" content={getMediaUrl('/' + data?.pageimage, 1440)} />
            <Navigation />
            <ScrollRestoration />
            <main>
                {!hasFiles && <Header aspectRatio="21" title={data?.title ?? ''} image={data?.pageimage} />}
                {hasFiles && <Header title={data?.title ?? ''} minimal={true} />}
                <div className={sideInfo ? 'product article--side' : ''}>
                    {error && <Error message="No connection to server" />}
                    {!data && <div className="loader"></div>}
                    {data && (
                        <>
                            <div className="product__content">
                                {hasFiles && (
                                    <div className="image">
                                        <img width="100%" src={getMediaUrl('/' + data?.pageimage, 1440)} />
                                    </div>
                                )}

                                <div className={sideInfo ? ' product__description' : 'product__description'}>
                                    <article>
                                        <Parser content={data?.content} />
                                    </article>
                                </div>
                            </div>
                            {sideInfo && (
                                <aside>
                                    {hasFiles && <FileList files={availableFiles} />}

                                    {data?.showSubpages && (
                                        <div className="card card--no-image">
                                            <div className="card__content">
                                                <h4 className="card__title">
                                                    <FormattedMessage
                                                        id="moreArticles"
                                                        defaultMessage="More Articles"
                                                    ></FormattedMessage>
                                                </h4>
                                                <div className="card__text">
                                                    <ArticleList query="namespace" value={data.namespace} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="product__info">
                                        <h3>
                                            <FormattedMessage id="furtherInfo" defaultMessage="Further Info" />
                                        </h3>
                                        <div className="description">
                                            {category && (
                                                <div className="description__item">
                                                    <div
                                                        style={{ backgroundColor: category.color }}
                                                        className="description__image"
                                                    >
                                                        <i
                                                            style={{ color: '#fff' }}
                                                            className="description__icon material-icons"
                                                        >
                                                            {category.icon}
                                                        </i>
                                                    </div>
                                                    <div className="description__text">
                                                        <div className="description__title">
                                                            <FormattedMessage id="category" defaultMessage="Category" />
                                                        </div>
                                                        <div className="description__data">{category.label}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {audience && (
                                                <div className="description__item">
                                                    <div className="description__image">
                                                        <i className="description__icon material-icons">groups</i>
                                                    </div>
                                                    <div className="description__text">
                                                        <div className="description__title">
                                                            <FormattedMessage id="audience" defaultMessage="Audience" />
                                                        </div>
                                                        <div className="description__data">{audience.label}</div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="description__item">
                                                <div className="description__image">
                                                    <i className="description__icon material-icons">event</i>
                                                </div>
                                                <div className="description__text">
                                                    <div className="description__title">
                                                        <FormattedMessage
                                                            id="lastUpdated"
                                                            defaultMessage="Last updated"
                                                        />
                                                    </div>
                                                    <div className="description__data">
                                                        <FormattedDate
                                                            value={new Date(data.date?.date.replace('-', '/'))}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {data.copyright && (
                                                <div className="description__item">
                                                    <div className="description__image">
                                                        <i className="description__icon material-icons">
                                                            report_problem
                                                        </i>
                                                    </div>
                                                    <div className="description__text">
                                                        <div className="description__title">
                                                            <FormattedMessage
                                                                id="copyright"
                                                                defaultMessage="Copyright"
                                                            />
                                                        </div>
                                                        <div className="description__data">{data.copyright}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {!!tagList.props.children.length && <>
                                                <h3>
                                                    <FormattedMessage
                                                        id="tags"
                                                        values={{ count: data.tags.length }}
                                                        defaultMessage="{count, plural, =0 {no tags} one {Tag} other {Tags}}"
                                                    ></FormattedMessage>
                                                </h3>
                                                <div className="pills py-2">
                                                    {tagList}
                                                </div>
                                            </>
                                        }

                                        <div>
                                            <h3>
                                                <FormattedMessage id="share" defaultMessage="Share" />
                                            </h3>
                                            <div className="share">
                                                 <ShareButtons title={data.title} tags={data.tags}/>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ArticlePage;
