import { domToReact } from 'html-react-parser';
import { Link } from 'react-router-dom';

import ArticleCards from '../../components/ArticleCards';
import ArticleList from '../../components/ArticleList';
import Banner from '../../components/content/Banner';
import BibleVerse from '../../components/content/BibleVerse';
import Box from '../../components/content/Box';
import DonationButton from '../../components/content/DonationButton';
import Newest from '../../components/content/Newest';
import Popular from '../../components/content/Popular';
import Subpage from '../../components/content/Subpage';

const options: any = {
    replace: (domNode: any) => {
        if (domNode.name === 'box') {
            const attribs = domNode.attribs || {};
            return <Box {...attribs}>{domToReact(domNode.children, options)}</Box>;
        }

        if (domNode.attribs && domNode.name === 'bible') {
            if (!domNode.attribs.verse) return <>{domNode.children}</>;
            return <BibleVerse verse={domNode.attribs.verse}>{domToReact(domNode.children)}</BibleVerse>;
        }

        if (domNode.attribs?.id && domNode.name === 'a') {
            return <Link to={domNode.attribs.id}>{domToReact(domNode.children)}</Link>;
        }

        if (domNode.name === 'newest') {
            return <Newest limit={domNode.attribs?.limit} title={domNode.attribs?.title} />;
        }

        if (domNode.name === 'popular') {
            return <Popular limit={domNode.attribs?.limit} title={domNode.attribs?.title} />;
        }

        if (domNode.name === 'subpage') {
            return <Subpage id={domNode.attribs?.id} />;
        }

        if (domNode.name === 'donation') {
            return <DonationButton className={domNode.attribs?.class}>{domToReact(domNode.children)}</DonationButton>;
        }

        if (domNode.name === 'banner') {
            return <Banner id={domNode.attribs?.id} link={domNode.attribs?.link} />;
        }

        if (domNode.attribs && domNode.name === 'subpages') {
            const attribute = ['tag', 'namespace', 'id'].filter(value => value in domNode.attribs);
            const style = domNode.attribs.style ?? 'cards';
            if (attribute.length !== 1) return <></>;
            const query = attribute[0];
            let props = {
                query,
                columns: domNode.attribs.columns ?? 3,
                value: domNode.attribs[query],
            };

            if (style === 'cards') return <ArticleCards {...props} />;
            return <ArticleList {...props} />;
        }
    },
};

export default options;
