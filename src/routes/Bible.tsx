import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArticleList from '../components/ArticleList';
import Combobox from '../components/base/Combobox';
import NumberSelect from '../components/base/NumberSelect';
import Header from '../components/common/Header';
import Navigation from '../components/navigation/Navigation';
import { Verse } from '../services/models/bible';
import { store } from '../services/store';
import useFetch from '../services/useFetch';
import useUrl from '../services/useUrl';

const Bible = () => {
    const params = useParams();
    const { book, chapter } = params;
    const { state } = useContext(store);

    const currentBook = state.bible.books.find(item => {
        return item.short_name === book;
    });

    const navigate = useNavigate();

    const url = useUrl({}, `/api/${state.lang}/bible/${currentBook?.id ?? 10}/${chapter}`);

    const { data, error } = useFetch<Array<Verse>>(url);

    const notesurl = useUrl({ pages: true }, `/api/${state.lang}/biblepages/${currentBook?.id ?? 10}/${chapter}`);

    const { data: tag, error: tagError } = useFetch(notesurl);

    const bibleurl = 'bible';
    const bookOptions = state.bible.books.map(book => {
        return { label: book.long_name, value: book.short_name };
    });

    const setBook = (bookId: number | string) => {
        navigate(`/${bibleurl}/${bookId}/1`, { preventScrollReset: true, replace: true });
    };

    const setChapter = (chapter: number) => {
        navigate(`/${bibleurl}/${currentBook?.short_name ?? 'genesis'}/${chapter}`, {
            preventScrollReset: true,
            replace: true,
        });
    };

    if (error) return <></>;

    return (
        <>
            <Navigation />
            <Header minimal aspectRatio="21" title={currentBook?.long_name + ' ' + chapter} />
            <div className="section bg-gray-300 py-12">
                <div className="content flex gap">
                    <Combobox options={bookOptions} onChange={setBook} placeholder={currentBook?.long_name} />
                    <NumberSelect max={currentBook?.chapters ?? 1} min={1} onChange={setChapter} />
                </div>
            </div>
            <section>
                <div className="container grid grid--columns-4 grid--gap-4">
                    <div className="grid__column--span-4 lg:grid__column--span-3">
                        <h4>Bibeltext</h4>
                        <div>
                            {data ? (
                                <ul>
                                    {data?.map(verse => {
                                        return (
                                            <li>
                                                <sup>{verse.verse}</sup>
                                                {verse.text}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <ul className="loader">
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="grid__column--span-4 lg:grid__column--span-1">
                        <h4>Artikel</h4>
                        <ArticleList query="bible" value={`${currentBook?.id}:${chapter}`} />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Bible;
