import { Article } from '../../services/models/article';
import useFetch from '../../services/useFetch';
import useUrl from '../../services/useUrl';

import { useContext } from 'react';
import { store } from '../../services/store';
import DonationButton from './DonationButton';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const DonationModal = (props: Props) => {
    const { state } = useContext(store);
    const { isOpen, onClose } = props;

    const args = {
        controller: 'page',
        method: 'get',
        id: 'system:donation',
        lang: state.lang,
    };

    const url = useUrl(args);
    const { data: donationArticle, error } = useFetch<Article>(url);
    console.log(error);
    if (error) return <></>;

    const className = isOpen ? 'modal modal--primary modal--open' : 'modal modal--primary';

    return (
        <div className={className}>
            <div className="modal__dialog">
                <div className="modal__header">
                    <h2 className="modal__title">{donationArticle?.title}</h2>
                    <button className="modal__close" onClick={() => onClose()} />
                </div>
                <div className="modal__description">{donationArticle?.abstract}</div>
                <div className="modal__content">
                    <p>{donationArticle?.content}</p>
                </div>
                <div className="modal__footer">
                    <div className="button-group">
                        <button className="button button--secondary">Na gut</button>
                        <DonationButton children={'Weitere Infos'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationModal;
