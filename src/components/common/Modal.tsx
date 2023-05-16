import React from 'react'

type Props = {
	isOpen: boolean
	onClose: () => void
	closeOnEsc: boolean
	closeOnOverlayClick: boolean
	children: React.ReactNode
	onOk?: () => void
	okText?: string
}

const Modal = (props: Props) => {

	const { isOpen, onClose, closeOnEsc, closeOnOverlayClick, children } = props
  return (
	<div className={"modal " + (isOpen ? ' modal--open' : '')} onClick={onClose}>
		<div className="modal__dialog">
			<div className="modal__header">
				<div className="modal__title"><h2>Modal</h2>
				</div>
				<button className="modal__close" onClick={props.onClose}></button>
			</div>
			<div className="modal__content">
				{children}
			</div>
			<div className="modal__footer">
				<div className='button-group button-group--right'>
					<button className="button button--secondary" onClick={props.onClose}>Schließen</button>
					{ props.onOk && <button className="button button--primary" onClick={props.onOk}>{ props.okText ?? 'OK' }</button> }
				</div>
			</div>
		</div>
	</div>
  )
}

export default Modal