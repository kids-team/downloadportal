import React, { useState } from 'react';

interface NumberSelectProps {
    max: number;
    min: number;
    onChange?: (number: number) => void;
}

const NumberSelect: React.FC<NumberSelectProps> = props => {
    const { max, min, onChange } = props;
    const [state, setState] = useState<number>(min);

    const setNumber = (number: number) => {
        if (number < min || number > max) return;
        setState(number);
        if (onChange) {
            onChange(number);
        }
    };

    return (
        <div className="number-picker number-picker--dropdown number-picker--large">
            <button onClick={() => setNumber(state - 1)}></button>
            <input
                className="number-picker__select"
                value={state}
                onChange={event => setNumber(parseInt(event.target.value))}
            />
            <ul>
                {Array.from({ length: max }, (x: number, i) => {
                    return (
                        <li onClick={() => setNumber(i)} key={i}>
                            {i}
                        </li>
                    );
                })}
            </ul>
            <button onClick={() => setNumber(state + 1)}></button>
        </div>
    );
};

export default NumberSelect;
