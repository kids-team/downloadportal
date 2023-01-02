import React from 'react';
import { useMediaUrl } from '../../services/useUrl';

export interface Props {
    title?: string;
    subtitle?: string;
    image?: string;
    minimal?: boolean;
    aspectRatio?: '21' | '16' | '12';
}

const Header: React.FC<Props> = props => {
    const { image, title, subtitle, aspectRatio, minimal } = props;

    const imageSrc: string = useMediaUrl(image, 1440);

    const className: string = [
        'header',
        minimal || image === 'error' ? 'header--minimal' : '',
        'header--left',
        'header--bottom',
    ]
        .filter(Boolean)
        .join(' ');

    console.log(image);

    return (
        <header className={className}>
            {image && image !== 'error' && <img alt="" src={imageSrc} />}

            <div className="header__content">
                <div>
                    <div className="header__title">
                        <h1 className="font-script">{title}</h1>
                        {subtitle && <h4 className="ml-4 xl:mr-0">{subtitle}</h4>}
                    </div>
                </div>
            </div>
        </header>
    );
};

Header.defaultProps = {
    aspectRatio: '16',
    image: '',
    title: '',
    minimal: false,
};

export default Header;
