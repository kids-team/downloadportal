import { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { store } from '../../services/store';

type Props = {
    tags: Array<string>;
    title: string;
};

const ShareButtons = (props: Props) => {
    const { tags, title } = props;

    const url = useLocation();
    const base = document.location.host;

    const { state } = useContext(store);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);

    const link = `${base + url.pathname}&lang=${state.lang}`;

    const copyContent = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const shareNavigator = async (url: string, title: string) => {
        if (navigator.share) {
            navigator
                .share({
                    title: title,
                    url: url,
                })
                .then(() => {
                    console.log('Thanks for sharing!');
                })
                .catch(console.error);
        }
    };

    return (
        <div>
            <div className="flex gap">
                <a
                    className="button button--icon button--primary hidden md:show"
                    href={'https://www.facebook.com/sharer/sharer.php?u=' + link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="material-icons">facebook</i>
                </a>
                <a
                    className="button button--icon button--primary hidden md:show"
                    href={`http://twitter.com/share?text=${title}&url=${link}&hashtags=${tags.join(',')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="material-icons">twitter</i>
                </a>
                <button
                    className="button button--icon button--primary hidden md:show"
                    onClick={() => copyContent(link)}
                >
                    <i className="material-icons">content_copy</i>
                </button>
                <button
                    className="button button--icon button--primary md:hidden"
                    onClick={() => shareNavigator(link, title)}
                >
                    <i className="material-icons">share</i>
                </button>
            </div>
            {copySuccess && (
                <div className="text-xs text-success flex--center mt-4">
                    <i className="material-icons text-xs text-green mr-2">check_circle</i>{' '}
                    <FormattedMessage id="copySuccess" defaultMessage="Link copied successfully" />
                </div>
            )}
        </div>
    );
};

export default ShareButtons;
