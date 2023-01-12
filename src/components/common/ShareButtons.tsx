import { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { store } from '../../services/store';

type Props = {};

const url = window.location.href;

const ShareButtons = (props: Props) => {
    const { state } = useContext(store);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);

    const link = `${url}&lang=${state.lang}`;

    const copyContent = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div>
            <div className="flex gap">
                <a
                    className="button button--icon button--primary"
                    href={'https://www.facebook.com/sharer/sharer.php?u=' + link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="material-icons">facebook</i>
                </a>
                <a
                    className="button button--icon button--primary"
                    href={'https://instagram.com/share?url=' + link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="material-icons">instagram</i>
                </a>
                <button className="button button--icon button--primary" onClick={() => copyContent(link)}>
                    <i className="material-icons">content_copy</i>
                </button>
            </div>
            {copySuccess && <div className="text-xs text-success flex--center mt-4">
				<i className='material-icons text-xs text-green mr-2'>done</i> <FormattedMessage id="copySuccess" defaultMessage="Link copied successfully"/>
				</div>}
        </div>
    );
};

export default ShareButtons;