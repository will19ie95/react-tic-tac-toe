import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// DONE Display the location for each move in the format (col, row) in the move history list.
// DONE Bold the currently selected item in the move list.
// Rewrite Board to use two loops to make the squares instead of hardcoding them.
// Add a toggle button that lets you sort the moves in either ascending or descending order.
// When someone wins, highlight the three squares that caused the win.
// When no one wins, display a message about the result being a draw.

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        place={i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function calculateXCoordinate(position) {
  const x = position % 3;
  return x;
}

function calculateYCoordinate(position) {
  const x = calculateXCoordinate(position);
  const y = (position - x) / 3;
  return y;
}

function RenderCoordinate(props) {
  return (
    <span>
      {props.position !== null && (
        <span>
          ({calculateXCoordinate(props.position)},
          {calculateYCoordinate(props.position)})
        </span>
      )}
    </span>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: null
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
    this.getNextPlayer = () => {
      return this.state.xIsNext ? "X" : "O";
    };
  }

  handleClick(i) {
    // const history = this.state.history;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const currentGame = history[history.length - 1];
    const squares = currentGame.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.getNextPlayer();
    this.setState({
      history: history.concat([{ squares, position: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const currentGame = history[this.state.stepNumber];
    const winner = calculateWinner(currentGame.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      const isSelectedMove = move === this.state.stepNumber;
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={isSelectedMove ? { fontWeight: 700 } : {}}
          >
            {desc}
          </button>
          <RenderCoordinate position={step.position} />
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + this.getNextPlayer();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentGame.squares}
            onClick={i => this.handleClick(i)}
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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
