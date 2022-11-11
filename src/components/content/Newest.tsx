import { useContext } from "react";
import { Article } from "../../services/models/article";
import { store } from "../../services/store";
import useFetch from "../../services/useFetch";
import useUrl from "../../services/useUrl";
import ArticleSlider from "./ArticleSlider";

type Props = {
	limit?: number
}

const Newest = (props: Props) => {

	const { state } = useContext(store)
	const { limit } = props;



	const args = {
		controller: 'pages',
		method: 'newest',
		lang: state.lang
	}

	const url = useUrl(args)
	const { data: articles, error } = useFetch<Array<Article>>(url);

	return (
		<div className="my-12">
			<h2>Neuste Artikel</h2>
			<ArticleSlider articleList={articles ?? []} />
		</div>
	)
}

export default Newest