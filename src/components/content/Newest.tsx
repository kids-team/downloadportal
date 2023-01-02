import { useContext } from 'react';
import { Article } from '../../services/models/article';
import { store } from '../../services/store';
import useFetch from '../../services/useFetch';
import useUrl from '../../services/useUrl';
import ArticleSlider from './ArticleSlider';

type Props = {
    limit?: number;
    title?: string;
};

const Newest = (props: Props) => {
    const { state } = useContext(store);
    const { limit, title } = props;

    const args = {
        controller: 'pages',
        method: 'newest',
        limit,
        lang: state.lang,
    };

    const url = useUrl(args);
    const { data: articles, error } = useFetch<Array<Article>>(url);

    if (error) return <></>;

    return (
        <div className="my-12">
            {title ? <h2 className="parser-block">{title}</h2> : <></>}
            <ArticleSlider articleList={articles ?? []} />
        </div>
    );
};

export default Newest;
