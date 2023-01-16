import { useContext } from "react";
import getTopLevelDomain from "../../services/getTopLevelDomain";
import { store } from "../../services/store";

type Props = {
	className?: string;
	children?: any;
	marginTop?: number;
	marginBottom?: number;
	align: 'right' | 'left' | 'center';
}

const DonationButton = (props: Props) => {

	const { className, children, marginTop, marginBottom, align } = props;
	const fallback = 'at';
	const { state } = useContext(store);
	const tld = getTopLevelDomain('at')
	
	const organization = state.organizations.find(org => org.domain === tld)
	console.log(tld)
	const style={marginTop: marginTop + 'rem',
	marginBottom: marginBottom + 'rem',
	display	: 'flex',
	justifyContent: 'right',
	alignItems: align
}

  	return (
		<div style={style}>
		<a href={organization?.donate} className="button button--primary">{children}</a>
		</div>
  	)
}

DonationButton.defaultProps = {
	marginTop: 1.5,
	marginBottom: 1.5,
	align: 'right'
}

export default DonationButton