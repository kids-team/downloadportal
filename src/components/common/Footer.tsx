
import React, { useContext } from 'react';
import Parser from '../../services/parser';
import { store } from '../../services/store';

const Footer: React.FC = () => {
	const { state } = useContext(store)
	const footer = state.footer;

	return (
		<footer className='footer'>
			<div className='content'><Parser content={footer} /></div>
		</footer>
	)
}

export default Footer