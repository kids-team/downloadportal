import { useContext } from 'react';
import { Article } from '../../services/models/article';
import Parser from '../../services/parser';
import { store } from '../../services/store';
import useFetch from '../../services/useFetch';
import useUrl from '../../services/useUrl';

type Props = {
    id: string;
};

const Subpage = (props: Props) => {
    const { id } = props;
    const { state } = useContext(store);

    const args = {
        controller: 'page',
        id,
        lang: state.lang,
    };

    const url = useUrl(args);
    const { data, error } = useFetch<Article>(url);

    if (error || !data?.content) return <></>;
    return <Parser content={data?.content} />;
};

export default Subpage;
