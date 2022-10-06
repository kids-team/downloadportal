import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/store';
import useMediaQuery from '../services/useMediaQuery';
import LanguageSelection from './LanguageSelection';
import MenuSearch from './MenuSearch';



interface MenuItem {
	children?: Array<MenuItem>;
	title: string;
	icon?: string;
	link: string;
	open?: boolean;
}

const Navigation : React.FC = () => {

	const [menuOpen, setMenuOpen] = useState<Boolean>(false);
	const [searchOpen, setSearchOpen] = useState<Boolean>(false);

	const { state } = useContext(store)
	const { items, claim, brand } = state.menu

	const mobile = useMediaQuery('(max-width: 1024px)')
	const navigate = useNavigate()
	const [menu, setMenu] = useState<Array<MenuItem>>(items)

	const openLink = (index: any) => {
		if(!mobile || !items[index].children ) {
			navigate(items[index].link)
			closeAllSubMenus()
			setMenuOpen(false)
			return;
		}

		let newItems: Array<MenuItem> = [...items];

		if(items[index].open) {
			newItems[index].open = false;
			setMenu(newItems)
			return;
		}
		closeAllSubMenus()
		newItems[index].open = !newItems[index].open
		setMenu(newItems)
	}

	const closeAllSubMenus = () => {
		if(menu == undefined) return
		let newItems = [...menu];
		newItems.forEach((item, index) => {
			newItems[index].open = false;
		})
		setMenu(newItems)
	}

	const openSubLink = (link: string) => {
		setMenuOpen(false)
		closeAllSubMenus()
		navigate(link)
	}

	const menuItems = () => {
		return <>{ items?.map((item: MenuItem, index: any) => {

			const classList = [
				'menu__item',
				item.children ? 'menu__item--has-dropdown ' : false,
				item.open ? 'menu__item--open' : false,
				items.length == index + 1 ? 'menu__item--last' : ''	
			].filter(Boolean).join(" ");

			return (
				<li key={index} className={classList}>
					<a onClick={() => openLink(index)}>
						<i className="menu__icon material-icons">{item.icon ? item.icon : ''}</i>
						<span>{item.title}</span>
						{ item.children && <i className="material-icons mobile__arrow">keyboard_arrow_down</i> }
					</a>
					{ item.children && <ul className="dropdown"> 
						{item.children.map((child, i) => {
							return <li key={i} className='dropdown__item'>
										<a onClick={() => {openSubLink(child.link)}}>
											<i className="menu__icon material-icons">{child.icon ? child.icon : ''}</i>
											<span>{child.title}</span>
										</a>
									</li>
							}) } 
					</ul> }
				</li>
			)
		})}</>
	}

	if(items == undefined || items.length === 0) return <></>
	return (
		<nav className={'top-bar ' + (searchOpen ? 'top-bar--search' : '')}>
			<a className="jump-to-content" href="#content">Content</a>
			<a href="/" className="top-bar__brand">
				<figure className='top-bar__logo'>
					<svg width="100%" height="100%" viewBox="0 0 29.382 29.381" xmlns="http://www.w3.org/2000/svg">
						<g transform="translate(-22.029 -89.542)">
						<g transform="matrix(.26458 0 0 .26458 21.772 85.819)">
							<path className="fill-primary" d="m56.496 125.12c30.665 0 55.525-24.858 55.525-55.523 0-30.666-24.86-55.524-55.525-55.524s-55.524 24.859-55.524 55.524 24.859 55.523 55.524 55.523"></path>
							<path d="m86.386 37.744h-11.501c-1.992 0-3.27 0.803-3.27 3.061 0 1.754 0.832 4.397 1.604 6.062-1.01 0.387-1.604 1.249-1.604 2.795 0 1.754 0.862 4.338 1.604 5.884l-1.307 0.119v1.516h14.473v-1.723h-11.5c-0.952-1.813-1.665-4.37-1.665-5.558 0-1.011 0.386-1.575 1.456-1.575h11.71v-1.723h-11.501c-0.952-1.813-1.665-4.191-1.665-5.558 0-1.011 0.386-1.576 1.456-1.576h11.71zm-2.735 25.916c0.922 1.306 1.487 3.001 1.487 4.427 0 2.021-0.773 2.378-2.467 2.378-1.902 0-2.497-0.594-2.497-2.586v-4.219zm-7.845-1.723c-2.704 0-4.19 1.485-4.19 5.23 0 1.485 0.238 3.298 0.564 4.457l1.456-0.267c-0.268-1.338-0.475-2.854-0.475-4.28 0-2.376 0.654-3.417 2.645-3.417h2.823v4.28c0 2.852 0.951 4.25 4.011 4.25 2.586 0 4.042-1.188 4.042-3.745 0-1.903-0.564-3.508-1.426-4.905l1.129-0.118v-1.485zm1.01 22.672c-2.437 0-3.715-0.979-3.715-3.687 0-2.7 1.278-3.563 3.715-3.563h1.307v7.25zm4.666 0h-1.814v-8.944h-2.792c-2.973 0-5.261 1.19-5.261 5.26 0 4.073 2.288 5.411 5.261 5.411h4.547c3.15 0 5.26-1.309 5.26-5.38 0-1.754-0.327-3.656-0.802-4.994l-1.396 0.3c0.387 1.426 0.683 3.09 0.683 4.575-1e-3 2.884-1.1 3.772-3.686 3.772m3.298 4.815c0.268 0.862 0.417 1.784 0.417 2.586 0 1.487-0.536 1.663-1.813 1.663h-9.986v-4.249l-1.485-0.177v4.426h-3.655l0.237 1.728h3.418v2.793h1.485v-2.794h10.165c2.288 0 3.12-0.981 3.12-3.271 0-1.04-0.238-2.203-0.564-3.03z" fill="#1a1a18"></path>
							<path d="m95.995 77.477c0-3.934-0.406-5.147-6.039-6.403-2.35-0.527-2.513-0.69-2.513-1.904 0-0.894 0.406-1.338 2.107-1.338 1.54 0 3.688 0.243 5.431 0.567l0.526-4.539c-1.743-0.446-4.498-0.648-5.998-0.648-5.915 0-7.537 1.742-7.537 5.916 0 3.688 0.446 4.984 5.228 6.161 3.161 0.771 3.201 0.935 3.201 2.188 0 1.174-0.283 1.66-2.026 1.66-2.188 0-4.337-0.404-5.957-0.892l-0.933 4.336c1.946 0.649 5.025 1.176 7.173 1.176 5.635-1e-3 7.337-2.23 7.337-6.28m-36.352-0.329c-0.851 0.729-2.391 1.541-3.728 1.541-1.54 0-2.107-0.853-2.107-2.229v-5.957c0-1.297 0.567-2.23 2.107-2.23 1.216 0 2.715 0.244 3.728 0.487zm-11.671-0.687c0 4.821 2.229 7.295 6.241 7.295 2.148 0 4.702-1.095 6.079-1.984l0.608 1.578h4.579v-28.612l-5.836 0.811v8.227c-1.337-0.324-3.404-0.567-5.025-0.567-4.619 0-6.646 2.635-6.646 7.295zm-4.254-12.847h-5.836v19.736h5.836zm0-8.673h-5.836v6.2h5.836zm-20.588 18.48 5.269 9.929h6.242l-5.431-9.929 5.187-9.807h-6.241zm-0.77 9.929v-28.612l-5.836 0.811v27.801z" fill="#fff"></path>
						</g>
						</g>
					</svg>
				</figure>
				<span className='top-bar__title'>{brand}</span>
			</a>
			
			<button onClick={() => {setMenuOpen(!menuOpen)}} className={'hamburger' + (menuOpen ? ' hamburger--active' : '')} type="button">
				<div>
					<span></span>
				</div>
			</button>
			
			
			<ul className= {"menu " + (menuOpen ? 'menu--open' : '')} id="hamburger-menu">	
				<li className='menu__filler'></li>
				{menuItems()}
				<LanguageSelection languages={state.menu.available_langs}/>
				{ mobile && 
					<ul className='menu__mobile'>
						<li><a>Über uns</a></li>
						<li><a>Impressum</a></li>
						<li><a><i className='material-icons'>email</i></a></li>
					</ul>
				}	
					
				
			</ul>
			
			<MenuSearch setSearchOpen={setSearchOpen} searchOpen={searchOpen} setMenuOpen={setMenuOpen} className=""/>
			
		</nav>
	)
}

export default Navigation