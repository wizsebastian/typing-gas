import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

const list = ["First", "Second", "Third", "Fourth", "Fifth"];
const colors = ["#FFD700", "#FFA07A", "#90EE90", "#ADD8E6", "#FFB6C1", "#D3D3D3"];

const App = () => {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem("backgroundColor") || "#FFD700");
  const [level, setLevel] = useState(localStorage.getItem("level") || 1);
  const [text, setText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [times, setTimes] = useState([]);
  const [step, setStep] = useState(name ? "level" : "name");
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!name) {
      setStep("name");
    } else if (!level) {
      setStep("level");
    } else {
      setStep("game");
    }
  }, [name, level]);

  useEffect(() => {
    if (currentWordIndex < list.length && text.toLowerCase() === list[currentWordIndex].toLowerCase()) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTimeRef.current) / 1000; // tiempo en segundos
      const performance = getPerformance(timeTaken, list[currentWordIndex].length);

      setTimes((prevTimes) => [...prevTimes, { word: list[currentWordIndex], time: timeTaken, label: performance.label }]);
      setScore((prevScore) => prevScore + performance.score);

      setText("");
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      startTimeRef.current = Date.now(); // reinicia el tiempo para la siguiente palabra
    }
  }, [text, currentWordIndex]);

  const getPerformance = (time, length) => {
    const expectedTime = length * 1.5; // tiempo esperado basado en la longitud de la palabra (1.5 segundos por carácter)

    if (time <= expectedTime * 0.5) return { label: "LEGEND", color: "green", score: 10 };
    if (time <= expectedTime * 0.75) return { label: "VERY WELL", color: "blue", score: 7 };
    if (time <= expectedTime) return { label: "WELL", color: "orange", score: 5 };
    return { label: "BAD", color: "red", score: 2 };
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("name", text);
    setName(text);
    setText("");
    setStep("level");
  };

  const handleLevelSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("level", text);
    setLevel(text);
    setText("");
    setStep("game");
  };

  const handleRepeat = () => {
    setText("");
    setCurrentWordIndex(0);
    setScore(0);
    setTimes([]);
    startTimeRef.current = Date.now();
  };

  const handleNextLevel = () => {
    alert("Next level feature not implemented yet!");
  };

  const progress = (currentWordIndex / list.length) * 100;

  const handleColorChange = (color) => {
    setBackgroundColor(color);
    localStorage.setItem("backgroundColor", color);
  };

  return (
    <div className="App" style={{ backgroundColor }}>
      {step === "name" && (
        <div className="centered">
          <h1>Hello, what's your name?</h1>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your name"
              className="chat-input"
            />
          </form>
        </div>
      )}
      {step === "level" && (
        <div className="centered">
          <h1>Select level to start: 1 - 10</h1>
          <form onSubmit={handleLevelSubmit}>
            <input
              type="number"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type level"
              className="chat-input"
              min="1"
              max="10"
            />
          </form>
        </div>
      )}
      {step === "game" && (
        <>
          <div className="header">
            <div>{name}</div>
            <div>Score: {score}</div>
          </div>
          <div className="color-picker">
            {colors.map((color, index) => (
              <div
                key={index}
                className="color-circle"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              ></div>
            ))}
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="results">
            {times.map((time, index) => {
              return (
                <div key={index} style={{ color: getPerformance(time.time, list[index].length).color }}>
                  {time.word}: {time.time.toFixed(2)} seconds ({time.label})
                </div>
              );
            })}
          </div>
          <div className="centered">
            {currentWordIndex < list.length ? (
              <h1>{getHighlightedText(list[currentWordIndex], text)}</h1>
            ) : (
              <div>
                <h1>YOU WIN!</h1>
                <div className="buttons">
                  <button onClick={handleRepeat} className="button">
                    ⟲ Repeat
                  </button>
                  <button onClick={handleNextLevel} className="button">
                    Next Level ➔
                  </button>
                </div>
              </div>
            )}
          </div>
          {currentWordIndex < list.length && (
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type here to match"
              className="chat-input"
            />
          )}
        </>
      )}
    </div>
  );
};

const getHighlightedText = (text, highlight) => {
  if (!highlight) return text;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => (
    <span key={index} className={part.toLowerCase() === highlight.toLowerCase() ? "highlight animate" : ""}>
      {part}
    </span>
  ));
};

export default App;
