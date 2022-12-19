import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { getMediaUrl } from '../../services/api';
import { Article } from '../../services/models/article';
import { store } from '../../services/store';
import useFetch from '../../services/useFetch';
import useUrl from '../../services/useUrl';

type Props = {
    id: string;
    link: string;
};

const Banner = (props: Props) => {
    const { id, link } = props;
    const { state } = useContext(store);

    const args = {
        controller: 'page',
        id,
        lang: state.lang,
    };

    const url = useUrl(args);
    const { data, error } = useFetch<Article>(url);
    const imageUrl = data?.pageimage ? getMediaUrl(data?.pageimage, 1440) : '';

    if (error || !data?.content) return <></>;
    return <Link to={link}>{imageUrl ? <img alt="" src={data.pageimage} /> : <></>}</Link>;
};

export default Banner;
