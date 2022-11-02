import React, { useRef, useState } from 'react';
import { Category } from '../services/models/article';

interface ComboboxProps {
	options: Array<{ label: string, value: string | number, icon?: string }> | Array<Category>
	placeholder?: string
	default?: string | number
	nullOption?: string
	className?: string;
	onChange?: (option: string | number) => void
}

const Combobox: React.FC<ComboboxProps> = (props) => {

	const { options, onChange, placeholder, nullOption, className } = props;

	const input = useRef<HTMLInputElement>(null);

	const [inputField, setInputField] = useState<string>('');
	const [selection, setSelection] = useState<number>(-1);
	const [listSelect, setListSelect] = useState<number>(-1);

	const dropdownSelect = (value: string | number, update = true) => {
		const index = options.findIndex((option) => option.value == value)
		setSelection(index);
		setInputField("");
		if (onChange && update) {
			onChange(options[index].value)
		}
	}

	const filteredOptions = () => {
		if (inputField.length === 0) return options;
		if (inputField.slice(-1) == "*") {
			return options.filter((option) => option.label.toLowerCase().startsWith(inputField.slice(0, -1).toLowerCase()))
		}
		return options.filter((option) => option.label.toLowerCase().includes(inputField.toLowerCase()))
	}

	const keyPress = (event: any) => {
		console.log(event)
		if (event.key == "ArrowDown") {
			console.log('down')
			setListSelect(listSelect + 1)
		}
		if (event.key == "ArrowUp" && listSelect != -1) setListSelect(listSelect - 1)
		if (event.key == "Enter") {
			dropdownSelect(filteredOptions()[listSelect].value);
			input.current?.blur();
		}
		if (event.key == "Escape") {
			setListSelect(-1);
			input.current?.blur();
		}
	}

	const nullSelect = () => {
		setListSelect(-1)
		dropdownSelect(0)
	}


	return (
		<div className={'combobox ' + className} onKeyDown={(event) => keyPress(event)}>
			<input ref={input} type="text" onMouseOver={() => { setListSelect(-1) }} onClick={(event) => { }} placeholder={selection != -1 ? options[selection].label : placeholder} value={inputField} onChange={(event) => setInputField(event.target.value)} />
			<ul>
				{nullOption !== '' && <>
					<li className={listSelect == -1 ? "selected" : ''} onMouseDown={(event) => { nullSelect() }}>
						{nullOption}
					</li>
				</>}
				{filteredOptions().map((option, index) => {
					return <li className={listSelect == index ? "selected" : ''} onMouseDown={(event) => { dropdownSelect(option.value) }} key={index}>
						{option.label}
					</li>
				})}
				{filteredOptions().length == 0 &&
					<li className="muted">No Result</li>
				}
			</ul>
		</div>
	)
}

Combobox.defaultProps = {
	placeholder: '',
	nullOption: '',
	className: ''
}

export default Combobox