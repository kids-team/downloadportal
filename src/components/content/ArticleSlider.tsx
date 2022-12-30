import { useEffect, useRef } from 'react';
import { Article } from '../../services/models/article';
import Card from '../base/Card';

interface Props {
    columns?: number;
    articleList: Array<Article>;
}

const ArticleSlider = (props: Props) => {
    const { articleList, columns } = props;

    const sliderContainer = useRef<HTMLDivElement>(null);

    const scrollRight = () => {
        console.log(
            sliderContainer.current?.scrollBy({ left: sliderContainer.current?.clientWidth, behavior: 'smooth' })
        );
    };

    const scrollLeft = () => {
        console.log(
            sliderContainer.current?.scrollBy({ left: -sliderContainer.current?.clientWidth, behavior: 'smooth' })
        );
    };

    useEffect(() => console.log(sliderContainer.current?.scrollLeft), [sliderContainer]);
    return (
        <div className="carousel">
            <div className="carousel__button" onClick={() => scrollLeft()}>
                <i className="material-icons">arrow_back</i>
            </div>
            <div className={'carousel__container carousel--columns-' + columns} ref={sliderContainer}>
                {articleList.map((article, key) => {
                    return (
                        <div className="carousel__item" key={key}>
                            <Card image={article.pageimage} link={article.id} title={article.title} />
                        </div>
                    );
                })}
            </div>
            <div className="carousel__button" onClick={() => scrollRight()}>
                <i className="material-icons">arrow_forward</i>
            </div>
        </div>
    );
};

ArticleSlider.defaultProps = {
    columns: 3,
};

export default ArticleSlider;
