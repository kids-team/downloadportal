import { useContext } from 'react';
import getTopLevelDomain from '../../services/getTopLevelDomain';
import { store } from '../../services/store';

type Props = {
    className?: string;
    children?: any;
    target?: string;
};

const DonationButton = (props: Props) => {
    const { className, children, target } = props;
    const { state } = useContext(store);
    const tld = getTopLevelDomain('at');
    const organization = state.organizations.find(org => org.domain === tld);

    return (
        <a target={target} href={organization?.donate} className={className}>
            {children}
        </a>
    );
};

DonationButton.defaultProps = {
    className: 'button button--primary',
    target: '_blank',
};

export default DonationButton;
