
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlagCode } from '../../services/getCurrentLanguage';
import { store } from '../../services/store';

import at from '../../icons/countries/at.svg';
import ch from '../../icons/countries/ch.svg';
import de from '../../icons/countries/de.svg';
import en from '../../icons/countries/en.svg';
import fr from '../../icons/countries/fr.svg';
import it from '../../icons/countries/it.svg';

type Props = {
	languages: Array<string>
}

const LanguageSelection = ({ languages }: Props) => {

	const getFlag = (country: string) => {
		switch (country) {
			case 'de':
				return de;
			case 'fr':
				return fr;
			case 'at':
				return at;
			case 'ch':
				return ch;
			case 'en':
				return en;
			case 'it':
				return it;
		}
	}

	const [open, setOpen] = useState(false)

	type countryNameType = {
		[key: string]: string
	}

	const countryNames: countryNameType = {
		de: "Deutsch",
		fr: "Francaise",
		en: "English"
	}

	const { state, dispatch } = useContext(store)
	const navigate = useNavigate();
	const setLanguage = (language: string) => {
		dispatch({ type: 'SET_LANG', payload: language })
		navigate('/')
	}

	return (
		<>
			<li className='menu__separator'></li>
			<li onClick={() => { setOpen(!open) }} className={'menu__item language-menu menu__item--last ' + (open ? 'menu__item--open' : '')}>
				<a href="#/"><span><img alt="" className="menu__icon lg:show lg:mr-0" height="12px" src={getFlag(getFlagCode(state.lang))} /><span className="lg:hidden language__name">{countryNames[state.lang]}</span></span>
					<i className="lg:hidden material-icons mobile__arrow">keyboard_arrow_down</i>
				</a>
				<ul className='dropdown'>
					{languages.map((language, index) => {
						if (language !== state.lang)
							return <li className="dropdown__item" key={index}><a onClick={() => setLanguage(language)}><img className="menu__icon lg:show" height="12px" src={getFlag(getFlagCode(language))} /><span>{countryNames[language]}</span></a></li>
					})}
				</ul>
			</li>
		</>
	)
}

export default LanguageSelection