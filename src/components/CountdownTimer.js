import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ initialTime, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else {
            onTimeUp();
        }
    }, [timeLeft, onTimeUp]);

    return <div className="timer">Time left: {timeLeft}s</div>;
};

export default CountdownTimer;