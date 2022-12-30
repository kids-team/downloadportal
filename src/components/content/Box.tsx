import Color from 'color';
import { useMediaUrl } from '../../services/useUrl';

type Props = {
    background?: string;
    inline?: boolean;
    children: any;
    color?: string;
    padding?: string;
    marginTop?: string;
    marginBottom?: string;
    image?: string;
};

const Box: React.FC<Props> = props => {
    const { inline, background, children, padding, color, marginBottom, marginTop, image } = props;

    const fg = color ?? (!!Color(background).contrast ? '#ffffff' : '#000000');

    const backgroundImage = 'url(' + useMediaUrl(image) + ')';

    const style = {
        backgroundColor: background,
        color: fg,
        padding: padding,
        backgroundImage: backgroundImage,
        marginBottom: marginBottom,
        marginTop: marginTop,
    };
    if (!!inline)
        return (
            <span className="box" style={style}>
                {children}
            </span>
        );
    return (
        <div className="box" style={style}>
            {children}
        </div>
    );
};

Box.defaultProps = {
    inline: false,
    padding: '1.5rem',
    background: '#fff',
};

export default Box;
