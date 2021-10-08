import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const ROWS_NUM = 20;
const COLS_NUM = 20;
function Square(props) {
    return (
        <button className={'square '+ (props.value === 'X' ? 'x-character' : 'o-character')} onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {    
    renderRow(rowIndex) {
        let boardRow = [];
        for (let i=0; i<COLS_NUM; i++) {
            boardRow.push(<Square key={`location${rowIndex}-${i}`}  value={this.props.squares[rowIndex][i]} onClick={() => this.props.onClick(rowIndex, i)}/>);
        }
        return boardRow;
    }

    render() {
        let board = [];
        for (let i=0; i<ROWS_NUM; i++) {
            board.push((
                <div key={`row${i}`} className="board-row">
                    {this.renderRow(i)}
                </div>
            ));
        }
        return (
            <div>                            
                {board}
            </div>
        );
    }   
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: createTwoDimensionArray(ROWS_NUM, COLS_NUM),
                    step: {
                        row: null,
                        col: null,
                    },
                },
            ],
            xIsNext: true,
            stepNumber: 0,            
        };
    }

    handleClick(row, col) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];        
        if(current.squares[row][col]){
            console.log('Filled');
            return;
        }
        const squares = current.squares.map(row => row.slice());
        squares[row][col] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                step: {
                    row: row,
                    col: col,
                },
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,           
        });
    }

    jumpTo(move) {
        this.setState({
            stepNumber: move,
            xIsNext: (move%2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`; 
        const moves = history.map((turn , move) => {
            const desc = move ? `Go to move # ${move}: ${turn.step.row + 1}-${turn.step.col + 1}` : 'Go to game start';
            return (
                <ListItem key={move} desc={desc} onClick={() => this.jumpTo(move)} class={this.state.stepNumber === move ? 'clicked' : ''}/>                
            );
        });   
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(row, col) => this.handleClick(row, col)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

class ListItem extends React.Component {    
    render() {       
        return (
            <li>
                <button className={this.props.class} onClick={this.props.onClick}>
                    {this.props.desc}
                </button>                
            </li>
        );
    }
}

function createTwoDimensionArray(rows, cols) {
    let arr = [];
    for(let i = 0; i < rows; i++) {
        arr.push(new Array(cols).fill(null));
    }
    return arr;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  