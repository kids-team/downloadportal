import { useContext, useState } from 'react';
import { getUrl } from '../services/api';
import { Book, Verse } from '../services/models/bible';
import { store } from '../services/store';

type Props = {
    verse: Object;
    children: any;
};

const BibleVerse = (props: Props) => {
    const { verse } = props;

    type bibleTextState = {
        verses: Array<Verse>;
        book: Book;
        query: {
            chapter: string;
            verse: string;
        };
    };

    const [visible, setVisible] = useState(false);
    const [bibleText, setBibleText] = useState<bibleTextState>({
        verses: [],
        book: {
            id: 0,
            long_name: '',
            short_name: '',
            translation: '',
            lang: '',
            section: '',
            order: 0,
            chapters: 0,
            testament: 'ot',
        },
        query: {
            chapter: '',
            verse: '',
        },
    });

    const open = () => {
        fetchVerse();
        setVisible(true);
    };

    const { state } = useContext(store);

    const args = {
        controller: 'bible',
        method: 'search',
        query: verse,
        lang: state.lang,
    };

    const url = getUrl('/', args);

    const fetchVerse = async () => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setBibleText(data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const close = () => {
        setVisible(false);
    };
    return (
        <a href="#/" tabIndex={0} onFocus={open} onBlur={close}>
            {props.children}
            <div className={`popup ${visible ? 'popup--active' : ''}`}>
                <div className="popup__head">
                    <h5 className="popup__title">
                        {bibleText.book?.long_name} {bibleText.query?.chapter},{bibleText.query?.verse}
                    </h5>
                    <small>{bibleText.book?.translation}</small>
                </div>
                <div className="popup__body">
                    {bibleText?.verses?.length === 0 && <span className="loading"></span>}
                    {bibleText?.verses?.length > 0 &&
                        Object.values(bibleText.verses).map(verse => {
                            return (
                                <span>
                                    <sup>{verse.verse}</sup>
                                    {verse.text}
                                </span>
                            );
                        })}
                </div>
            </div>
        </a>
    );
};

export default BibleVerse;
