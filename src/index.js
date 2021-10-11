import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const ROWS_NUM = 20;
const COLS_NUM = 20;
function createTwoDimensionArray(rows, cols) {
    let arr = [];
    for(let i = 0; i < rows; i++) {
        arr.push(new Array(cols).fill(null));
    }
    return arr;
}

function Square(props) {
    return (
        <button className={'square '+ (props.value === 'X' ? 'x-character' : 'o-character')} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function Board(props) {
    const renderRow = (rowIndex) => {
        let boardRow = [];
        for (let i=0; i<COLS_NUM; i++) {
            boardRow.push(<Square key={`location${rowIndex}-${i}`}  value={props.squares[rowIndex][i]} onClick={() => props.onClick(rowIndex, i)}/>);
        }
        return boardRow;
    }

    
    let board = [];
    for (let i=0; i<ROWS_NUM; i++) {
        board.push((
            <div key={`row${i}`} className="board-row">
                {renderRow(i)}
            </div>
        ));
    }
    return (
        <div>                            
            {board}
        </div>
    );     
}

function ListItem(props) {              
    return (
        <li>
            <button className={props.class} onClick={props.onClick}>
                {props.desc}
            </button>                
        </li>
    );  
}

function Game(props) {
    const [history, setHistory] = useState([{
        squares: createTwoDimensionArray(ROWS_NUM, COLS_NUM),
        step: {
            row: null,
            col: null,
        },
    }]);
    const [xIsNext, setXIsNext] = useState(true);
    const [stepNumber, setStepNumber] = useState(0);

    const handleClick = (row, col) => {
        const historyClone = history.slice(0, stepNumber + 1);
        const current = historyClone[historyClone.length - 1];        
        if(current.squares[row][col]){
            console.log('Filled');
            return;
        }
        const squares = current.squares.map(row => row.slice());
        squares[row][col] = xIsNext ? 'X' : 'O';
        setHistory(historyClone.concat([{
            squares: squares,
            step: {
                row: row,
                col: col,
            },
        }]));
        setStepNumber(historyClone.length);
        setXIsNext(!xIsNext);        
    }

    const jumpTo = (move) => {
        setStepNumber(move);
        setXIsNext((move%2) === 0);        
    }
    
    const historyClone = history;
    const current = historyClone[stepNumber];
    const status = `Next player: ${xIsNext ? 'X' : 'O'}`; 
    const moves = historyClone.map((turn , move) => {
        const desc = move ? `Go to move # ${move}: ${turn.step.row + 1}-${turn.step.col + 1}` : 'Go to game start';
        return (
            <ListItem key={move} desc={desc} onClick={() => jumpTo(move)} class={stepNumber === move ? 'clicked' : ''}/>                
        );
    });   
    return (
        <div className="game">
            <div className="game-board">
                <Board squares={current.squares} onClick={(row, col) => handleClick(row, col)}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );    
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  