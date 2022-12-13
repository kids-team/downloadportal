import { ScrollRestoration, useParams } from 'react-router-dom';
import Error from '../components/Error';
import Navigation from '../components/navigation/Navigation';
import { Article } from '../services/models/article';
import Parser from '../services/parser';
import useFetch from '../services/useFetch';
import useUrl, { useMediaUrl } from '../services/useUrl';

const ArticlePage = () => {
    const { '*': id } = useParams();

    const args = {
        controller: 'page',
        id: id ? id : 'start',
    };

    const url = useUrl(args);
    const { data, error } = useFetch<Article>(url);

    const fileList = () => {
        if (!data?.files) return [];
        return data.files.filter(file => file.extension !== 'jpg' && file.extension !== 'jpeg');
    };

    const availableFiles = fileList();
    console.log(data);

    const hasFiles = availableFiles.length > 0;
    const sideInfo = data?.showSubpages || hasFiles;
    const countFiles = availableFiles.length;

    const imageSrc: string = useMediaUrl(data?.pageimage, 1440);

    return (
        <div>
            <Navigation />
            <ScrollRestoration />

            <header className="header" style={{ backgroundColor: '#e7caac' }}>
                <div className="header__content align-self-end">
                    <div>
                        <h3>Über 400 Dateien</h3>
                        <p>
                            Hier bekommst du haufenweise Material für deine Kinderstunden, den Reliunterrricht,
                            Kinderzeltlager - und vieles andere, was dich bei deiner Arbeit mit Kindern unterstützen
                            kann. Stöbere einfach herum oder benutze die Suchfunktion.
                        </p>
                    </div>
                    <div>
                        <div className="header__title">
                            <a className="button button--primary" href="">
                                Über uns
                            </a>
                            <h1 className="font-script">{data?.title}</h1>
                        </div>
                    </div>
                </div>

                {data?.pageimage && <img src={imageSrc} style={{ objectPosition: 'right' }} />}
            </header>
            <div>
                Bald ist Weihnachten! <a href="">Mehr dazu</a>
            </div>

            <div className="py-12">
                {error && <Error message="No connection to server" />}
                {!data && <div className="loader"></div>}
                {data && (
                    <div className="">
                        <div className="">
                            <div className={''}>
                                <Parser content={data?.content} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <section className="bg-gray-300 py-8 section--rounded"></section>
        </div>
    );
};

export default ArticlePage;
