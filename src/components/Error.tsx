import React from 'react'

interface Props {
	title?: string,
	message: string,
	icon?: string
}
const Error : React.FC<Props> = props => {
  return (
	<div className="alert alert--error h-full mx-8">
		<h2 className='alert__title'>
			<i className="material-icons mr-2 font-normal">{props.icon}</i>
			{props.title}
		</h2>
		<p className='alert__text'>
			{props.message}
		</p>
	</div>
  )
}

Error.defaultProps = {
	title: "Error",
	message: "An unknown error has occured.",
	icon: "sentiment_dissatisfied"
}

export default Error