import React from "react";
import "./styles.css";
import { shuffle, NumberBoxPM } from "./toolbox.js";
import { flipCross } from "./flip.js";

// --------------------------------------------------------

function ifAllLightsOn(array) {
  //check if all squares are 'O'
  for (let i = 0; i < 25; i++) {
    if (array[i] !== "O") return false;
  }
  return true;
}

function drawSolutionTable(array) {
  const ST = Array(25).fill("");

  for (let i = 0; i < array.length; i++) {
    ST[array[i]] = "O";
  }

  let ListItem = [];
  let ListItem2 = [];
  for (let i = 0; i < 5; i++) {
    ListItem = [];
    for (let j = 0; j < 5; j++) {
      ListItem.push(<td key={i * 5 + j}>{ST[i * 5 + j]}</td>);
    }
    ListItem2.push(<tr key={i}>{ListItem}</tr>);
  }

  return (
    <table className="solutionTable">
      <tbody>{ListItem2}</tbody>
    </table>
  );
}

class SolutionField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answerLock: false
    };
  }

  lockSolution() {
    this.setState(state => ({ answerLock: !state.answerLock }));
  }

  render() {
    return (
      <div className="solution">
        <p>
          <button className="SolutionButton" onClick={this.props.onClick}>
            solution
          </button>
          <input
            type="checkbox"
            id="solCheck"
            onChange={() => this.lockSolution()}
          />
          <label className="solLabel" htmlFor="solCheck">
            keep display
          </label>
        </p>
        <div>
          {this.props.showAnswer || this.state.answerLock
            ? drawSolutionTable(this.props.solution)
            : ""}
        </div>
      </div>
    );
  }
}

function NewGameField(props) {
  return (
    <div className="newGameField">
      <button className="NewGameButton" onClick={props.onClick}>
        New Game
      </button>
      <NumberBoxPM id={props.id} max="25" value="5" />
    </div>
  );
}

function Square(props) {
  let style = !props.style ? "square" : "square-on";
  return (
    <button className={style} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        style={this.props.style[i]}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderBoard(base) {
    let ListItem = [];
    let ListItem2 = [];

    for (let i = 0; i < base; i++) {
      ListItem = [];
      for (let j = 0; j < base; j++) {
        ListItem.push(this.renderSquare(i * base + j));
      }
      ListItem2.push(
        <div className="board-row" key={i}>
          {ListItem}
        </div>
      );
    }

    return <div>{ListItem2}</div>;
  }

  render() {
    return this.renderBoard(5);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(25).fill(""),
          squareStyles: Array(25).fill(0)
        }
      ],
      stepNumber: 0,
      solution: [0, 1, 5, 6, 8, 9, 12, 13, 14, 16, 17, 18, 21, 22, 24],
      showAnswer: false,
      value: 5
    };
  }

  //showSolution: Show/Hide SolutionTable.
  showSolution() {
    this.setState(state => ({ showAnswer: !state.showAnswer }));
  }

  //newGame: Generate a n-step new game.
  newGame() {
    const step = document.getElementById("selectStep").value;
    const aryNew = Array(25).fill("O");
    const styleNew = Array(25).fill(0);
    let solutionA = Array(25).fill(0);

    for (let i = 0; i < 25; i++) {
      solutionA[i] = i;
    }

    shuffle(solutionA);
    const solutionB = solutionA.slice(0, step);
    solutionA = null;

    for (let i = 0; i < step; i++) {
      flipCross(aryNew, solutionB[i]);
    }

    // Renew game status
    this.setState({
      history: [
        {
          squares: aryNew,
          squareStyles: styleNew
        }
      ],
      stepNumber: 0,
      solution: solutionB,
      showAnswer: false
    });
  }

  //handleClick: When click the board
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squaresNew = current.squares.slice();
    const styleNew = current.squareStyles.slice();

    //if (game clear)=lightsOn then return
    if (ifAllLightsOn(squaresNew)) {
      return;
    }

    //flip 'O'/'' to squares
    flipCross(squaresNew, i);
    styleNew[i] = 1 - styleNew[i];

    //add the (newest step of squares)=squareNew into history
    this.setState({
      history: history.concat([
        {
          squares: squaresNew,
          squareStyles: styleNew
        }
      ]),
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const lightOn = ifAllLightsOn(current.squares);

    //moves: 0: Goto game start | 1up: Goto move #
    const moves = history.map((_step, move) => {
      const desc = move ? "Go to #" + move : "Go to start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    //statusLightOn: show if all lights on
    let status;
    status = lightOn ? "Game Clear!" : "";

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            style={current.squareStyles}
            onClick={i => this.handleClick(i)}
          />
          <NewGameField id="selectStep" onClick={() => this.newGame()} />
          <SolutionField
            solution={this.state.solution}
            showAnswer={this.state.showAnswer}
            onClick={() => this.showSolution()}
          />
        </div>
        <div className="game-info">
          <p>{status}</p>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// --------------------------------------------------------

export default function App() {
  return <Game />;
}
