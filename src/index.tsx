import React from "react";
import ReactDOM from "react-dom";
import { Repeat } from "typescript-tuple";
import "./index.css";

type SquareState = "O" | "X" | null;
type SquareProps = {
  value: SquareState;
  onClick: () => void;
};

const Square = (props: SquareProps) => (
  <button className="square" onClick={props.onClick}>
    {props.value}
  </button>
);

type BoardState = Repeat<SquareState, 9>;
type BoardProps = {
  squares: BoardState;
  onClick: (i: number) => void;
};
const Board = (props: BoardProps) => {
  const table = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const renderSquare = (i: number, key: number) => (
    <Square
      key={key}
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
    />
  );

  return (
    <div>
      {table.map((row, rowIdx) => {
        return (
          <div className="board-row" key={rowIdx}>
            {row.map((square, colIdx) => {
              return renderSquare(square, colIdx);
            })}
          </div>
        );
      })}
    </div>
  );
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  nextMark() {
    return this.state.xIsNext ? "X" : "O";
  }

  handleClick(i) {
    const stepNumber = this.state.stepNumber + 1;
    const oldHistory = this.state.history.slice(0, stepNumber);
    const current = oldHistory.at(-1);
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.nextMark();
    const history = oldHistory.concat([{ squares }]);
    const xIsNext = !this.state.xIsNext;
    this.setState({ history, stepNumber, xIsNext });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const current = this.state.history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const status = winner
      ? `Winner: ${winner}`
      : `Next player: ${this.nextMark()}`;
    const moves = this.state.history.map((_step, move) => {
      const desc = move ? `Go to move #${move}` : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          {move === this.state.stepNumber ? " ←" : ""}
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
