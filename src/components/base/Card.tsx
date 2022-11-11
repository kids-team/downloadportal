import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLink } from '../../services/api';
import useIntersectionObserver from '../../services/hooks/useIntersectionObserver';
import { useMediaUrl } from '../../services/useUrl';

type Props = {
	image?: string;
	title: string;
	subtitle?: string;
	text?: string;
	link: string;
	label?: string;
	badge?: string;
	footer?: React.ReactNode
}

const Card: React.FC<Props> = (props) => {
	const {
		image, title, subtitle, text, link, label, badge, footer
	} = props;

	const imgRef = useRef<HTMLDivElement>(null);
	const entry = useIntersectionObserver(imgRef, { freezeOnceVisible: true });
	console.log(entry?.isIntersecting)
	const [imageLoaded, setImageLoaded] = useState(false);

	const imgSrc = useMediaUrl(image, 800)

	return (<Link className='card card--image-top card--white card--shadow card--hover card--primary' to={getLink(link)}>
		<div className='card__image' ref={imgRef}>
			{badge && <b className='card__badge'>{badge}</b>}
			{image && entry?.isIntersecting &&
				<img className={imageLoaded ? '' : 'hidden'} src={imgSrc} onLoad={() => setImageLoaded(true)} />}
			{!image && <div className='card__image--replace'></div>}
			{image && !imageLoaded && <div className='card__image--loading'><div className='loader'></div></div>}
		</div>
		<div className='card__content'>
			<div className='card__label'>{label}</div>
			<div className='card__title'>
				{title}
			</div>
			<div className='card__subtitle'>
				{subtitle}
			</div>
			<div className='card__text'>
				{text}
			</div>
			{footer && <div className='card__footer card__footer--dotted'>
				{footer}
			</div>}
		</div>
	</Link>)
}

export default Card