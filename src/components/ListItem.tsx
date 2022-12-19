import { Link } from 'react-router-dom';
import { useMediaUrl } from '../services/useUrl';

interface ListItemProps {
    round?: boolean;
    icon?: string;
    image?: string;
    title: string;
    description?: string;
    subtitle?: string;
    link: string;
}

const ListItem: React.FC<ListItemProps> = props => {
    const { round, icon, image, title, subtitle, description, link } = props;

    const media = useMediaUrl(image, 200);

    return (
        <Link to={link} className="list__item">
            {media && <img alt="" className={'list__image' + (round ? ' list__image--round' : '')} src={media} />}
            {icon && <i className="material-icons">{icon}</i>}
            <div className="item__content">
                <span className="list__title">{title}</span>
                {subtitle && <span className="item__subtitle">{subtitle}</span>}
                {description && <span className="list__subtitle list__subtitle--ellipsis">{description}</span>}
            </div>
        </Link>
    );
};

export default ListItem;
