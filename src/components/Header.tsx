import React from 'react';
import { useMediaUrl } from '../services/useUrl';

export interface Props {
	title?: string;
	subtitle?: string;
	image?: string;
	height?: number;
}

const Header: React.FC<Props> = props => {

	const { image, title, subtitle, height } = props;

	const imageSrc : string = useMediaUrl(image);
  
	return (
		<header className="header" style={{paddingTop: `${height}vh`}}>
				
				{ image && <img src={imageSrc} /> }
				
				<div className="content">
					<div className="header__title">
						<h1 className="font-script">{title}</h1>
						{ subtitle && <h4 className="ml-4 xl:mr-0">{subtitle}</h4> }
					</div>
				</div>
		</header>
  	)
}

Header.defaultProps = {
	height: 30,
	image: "",
	title: ""
};

export default Header