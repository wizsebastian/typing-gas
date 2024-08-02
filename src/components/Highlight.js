import React, { useState, useEffect } from 'react';
import './styles.css';
const HighlightInput = () => {
    const [inputValue, setInputValue] = useState('');
    const [highlightedText, setHighlightedText] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        const regex = new RegExp(`(${inputValue})`, 'gi');
        const newText = 'QUESO'.replace(regex, `<span class="highlight">$1</span>`);
        setHighlightedText(newText);
    }, [inputValue]);

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Escribe aquí"
            />
            <div
                dangerouslySetInnerHTML={{ __html: highlightedText }}
                className="highlight-container"
            />
        </div>
    );
};

export default HighlightInput;
