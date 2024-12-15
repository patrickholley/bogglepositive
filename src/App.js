import React, { useEffect, useState } from "react";
import solveBoard from "./solveBoard";
import "./App.css";

const BOARD_DIMENSION = 4;

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

/**
 * @return Array of arrays representing values on a square board. BOARD_DIMENSION dictates the size.
 * @example
 * [
 *   ['b', 'q', 'm', 'p'],
 *   ['t', 'i', 'g', 'o'],
 *   ['i', 'j', 'z', 'l'],
 *   ['o', 'g', 'k', 'c'],
 * ]
 */
const createRandomBoard = () => {
  const boardValues = [];
  for (let i = 0; i < BOARD_DIMENSION; i++) {
    boardValues[i] = [];
    for (let j = 0; j < BOARD_DIMENSION; j++) {
      boardValues[i][j] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
  }
  return boardValues;
};

function App() {
  // Array of words used as the application's dictionary
  const [board, setBoard] = useState("");
  const [dictionary, setDictionary] = useState();
  const [solutions, setSolutions] = useState([]);
  const [error, setError] = useState("");
  /*
   * Load the dictionary upon init of the page. This file is quite large so hopefully by the time the user has
   * finished entering all the values into the Boggle board, we have downloaded the massive dictionary.
   *
   * dictionary.json was modified based on twl06.txt found at https://www.wordgamedictionary.com/twl06/download/twl06.txt
   */
  useEffect(() => {
    import("./dictionary_en_US.json").then((data) => {
      setDictionary(data.words.filter((word) => word.length >= 3));
    });
  }, []);

  // Validator function
  const isValidMatrix = (input) => {
    try {
      const sanitizedInput = input
        .replace(/'/g, '"') // Replace single quotes with double quotes for valid JSON
        .replace(/"+/g, '"') // Remove duplicate/multiple quotes
        .replace(/\s+/g, "") // Explicitly remove all whitespace chars
        .replace(/(?<!["'])\b[a-zA-Z]\b(?!["'])/g, '"$&"') // Add quotes only to unquoted single letters
        .replace(/,\s*]/g, "]") // Remove extra commas before closing brackets
        .replace(/],\s*]/g, "]]"); // Remove extra commas for nested arrays;

      const parsed = JSON.parse(sanitizedInput);

      if (!Array.isArray(parsed) || parsed.length !== BOARD_DIMENSION) {
        return false;
      }

      return parsed.every((row) => {
        return (
          Array.isArray(row) &&
          row.length === BOARD_DIMENSION &&
          row.every(
            (cell) =>
              typeof cell === "string" &&
              cell.length === 1 &&
              ALPHABET.includes(cell),
          )
        );
      });
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleChange = (e) => {
    const input = e.target.value;

    if (isValidMatrix(input)) {
      setError("");
    } else {
      setError(
        `Input must be a valid ${BOARD_DIMENSION}x${BOARD_DIMENSION} matrix of single letters (check square brackets, no periods, etc).`,
      );
    }

    setBoard(input);
  };

  const handleRandomBoard = () => {
    const randomBoard = createRandomBoard();
    const boardString = JSON.stringify(randomBoard);
    setBoard(boardString);
    setError("");
  };

  return (
    <div className="app-container">
      <h1>🌠 Boggle Posit-ive! 🌠</h1>
      <p>
        Either copy-paste your own {BOARD_DIMENSION}x{BOARD_DIMENSION} board, or
        hit the{" "}
        <span style={{ backgroundColor: "#e0c100" }}>&nbsp;Random&nbsp;</span>{" "}
        button for some fun!
      </p>
      <div className="input-container">
        <textarea
          placeholder={
            '[["b","q","m","p"],["t","i","g","o"],["i","j","z","l"],["o","g","k","c"]]'
          }
          value={board}
          onChange={handleChange}
          className="board-input"
        />
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button
            onClick={handleRandomBoard}
            className="random-board-button button"
          >
            Random 🎲
          </button>
          <button
            disabled={!!error || !board}
            onClick={() =>
              setSolutions(solveBoard(JSON.parse(board), dictionary))
            }
            className="solve-button button"
          >
            Solve 💡
          </button>
        </div>
      </div>
      <div className="solutions-container">
        <h2>Solutions ✅</h2>
        {solutions.length ? (
          <div>
            <p>Results: {solutions.length}</p>
            <ul className="results-list">
              {solutions.map((word, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>
            No solutions. Enter a (different) board and click{" "}
            <span style={{ backgroundColor: "#007bff", color: "white" }}>
              &nbsp;Solve&nbsp;
            </span>
            .
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
