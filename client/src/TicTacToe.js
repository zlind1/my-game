import React from 'react';
import {Container} from 'react-bootstrap';

let canvas, container, ctx, board, xturn, cellSize;

class TicTacToe extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.canvasRef = React.createRef();
  }
  reset = () => {
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    xturn = true;
    this.redraw();
  }
  initVariables = () => {
    canvas = this.canvasRef.current;
    container = this.containerRef.current;
    ctx = canvas.getContext('2d');

    ctx.strokeStyle = 'black';
    this.reset();
  }
  checkWinner = () => {
    var rowMatch = -1;
    var colMatch = -1;
    var diagMatch = -1;
    for (var i = 0; i < 3; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        if (board[i][0] !== '') rowMatch = i;
      }
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        if (board[0][i] !== '') colMatch = i;
      }
    }
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (board[0][0] !== '') diagMatch = 0;
    }
    if (board[2][0] === board[1][1] && board[1][1] === board[0][2]) {
      if (board[2][0] !== '') diagMatch = 1;
    }
    var matchFound = false;
    if (rowMatch !== -1) {
      matchFound = true;
      ctx.beginPath();
      ctx.moveTo(cellSize/4, rowMatch*cellSize+cellSize/2);
      ctx.lineTo(canvas.width-cellSize/4, rowMatch*cellSize+cellSize/2);
      ctx.stroke();
    }
    if (colMatch !== -1) {
      matchFound = true;
      ctx.beginPath();
      ctx.moveTo(colMatch*cellSize+cellSize/2, cellSize/4);
      ctx.lineTo(colMatch*cellSize+cellSize/2, canvas.height-cellSize/4);
      ctx.stroke();
    }
    if (diagMatch !== -1) {
      matchFound = true;
      ctx.beginPath();
      if (diagMatch === 0) {
        ctx.moveTo(cellSize/4, cellSize/4);
        ctx.lineTo(canvas.width-cellSize/4, canvas.height-cellSize/4);
      } else {
        ctx.moveTo(canvas.width-cellSize/4, cellSize/4);
        ctx.lineTo(cellSize/4, canvas.height-cellSize/4);
      }
      ctx.stroke();
    }
    return matchFound;
  }
  drawLines = () => {
    ctx.beginPath();
    ctx.moveTo(cellSize, 0);
    ctx.lineTo(cellSize, canvas.height);
    ctx.moveTo(2*cellSize, 0);
    ctx.lineTo(2*cellSize, canvas.height);
    ctx.moveTo(0, cellSize);
    ctx.lineTo(canvas.width, cellSize);
    ctx.moveTo(0, 2*cellSize);
    ctx.lineTo(canvas.width, 2*cellSize);
    ctx.stroke();
  }
  drawMarks = () => {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board[i][j] === 'x') ctx.fillStyle = 'red';
        else ctx.fillStyle = 'green';
        ctx.fillText(board[i][j], canvas.width/10+j*cellSize, 9*canvas.width/40+i*cellSize);
      }
    }
  }
  redraw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawLines();
    this.drawMarks();
  }
  handleClick = (event) => {
    var offX = canvas.offsetLeft;
    var offY = canvas.offsetTop;
    var i = Math.floor((event.clientY-offY) / cellSize);
    var j = Math.floor((event.clientX-offX) / cellSize);
    if (isNaN(i) || isNaN(j)) {
      return;
    }
    if (board[i][j] !== '') {
      return;
    } else if (xturn) {
      board[i][j] = 'x';
      xturn = false;
    } else {
      board[i][j] = 'o';
      xturn = true;
    }
    this.redraw();
    // check for 3 in a row
    var gameover = this.checkWinner();
    if (gameover) {
      setTimeout(() => {
        alert((xturn ? 'O' : 'X')+' wins!');
        this.reset();
      }, 50);
    }
  }
  handleResize = () => {
    let min = (a, b) => (a < b ? a : b);
    canvas.width = min(container.offsetWidth-32, window.innerHeight-32);
    canvas.height = canvas.width;
    cellSize = canvas.width/3;
    ctx.font = (canvas.width/4)+'px sans-serif';
    ctx.lineWidth = canvas.width/120;
    this.redraw();
  }
  componentDidMount() {
    document.title = 'Tic Tac Toe';
    this.initVariables();
    this.handleResize();
    window.onresize = this.handleResize;
    canvas.onclick = canvas.ontouchstart = this.handleClick;
    this.redraw();
  }
  render() {
    return(
      <Container ref={this.containerRef} className='d-flex justify-content-center p-3'>
        <canvas ref={this.canvasRef} width='600' height='600'></canvas>
      </Container>
    );
  }
}

export default TicTacToe;
