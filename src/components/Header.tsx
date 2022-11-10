import React from 'react';
import { useMediaUrl } from '../services/useUrl';

export interface Props {
	title?: string;
	subtitle?: string;
	image?: string;
	minimal?: boolean;
	aspectRatio?: "21" | "16" | "12";
}

const Header: React.FC<Props> = props => {

	const { image, title, subtitle, aspectRatio, minimal } = props;

	const imageSrc: string = useMediaUrl(image, 1440);

	const className: string = [
		'header',
		minimal ? 'header--minimal' : 'aspect-12/9 lg:aspect-' + aspectRatio + '/9',
		'header--left',
		'header--bottom',
		'fill-body'
	].filter(Boolean).join(' ')

	return (
		<header className={className}>
			{image && <img src={imageSrc} />}


			<div className="header__title">
				<h1 className="font-script">{title}</h1>
				{subtitle && <h4 className="ml-4 xl:mr-0">{subtitle}</h4>}
			</div>

		</header>
	)
}

Header.defaultProps = {
	aspectRatio: "16",
	image: "",
	title: "",
	minimal: false
};

export default Header