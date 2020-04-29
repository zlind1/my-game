import React from 'react';

let canvas, ctx, board, xturn;

class TicTacToe extends React.Component {
  constructor(props) {
    super(props);
    this.cref = React.createRef();
  }
  initVariables = () => {
    canvas = this.cref.current;
    ctx = canvas.getContext('2d');
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    xturn = true;

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.font = '150px sans-serif';
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
      console.log('row match: row '+rowMatch+', '+board[rowMatch][0]);
      matchFound = true;
      ctx.beginPath();
      ctx.moveTo(50, rowMatch*200+100);
      ctx.lineTo(550, rowMatch*200+100);
      ctx.stroke();
    }
    if (colMatch !== -1) {
      console.log('col match: col '+colMatch+', '+board[0][colMatch]);
      matchFound = true;
      ctx.beginPath();
      ctx.moveTo(colMatch*200+100, 50);
      ctx.lineTo(colMatch*200+100, 550);
      ctx.stroke();
    }
    if (diagMatch !== -1) {
      console.log('diag match: down '+(diagMatch === 0 ? 'right' : 'left')+', '+board[1][1]);
      matchFound = true;
      ctx.beginPath();
      if (diagMatch === 0) {
        ctx.moveTo(50, 50);
        ctx.lineTo(550, 550);
      } else {
        ctx.moveTo(550, 50);
        ctx.lineTo(50, 550);
      }
      ctx.stroke();
    }
    return matchFound;
  }
  drawLines = () => {
    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 600);
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 600);
    ctx.moveTo(0, 200);
    ctx.lineTo(600, 200);
    ctx.moveTo(0, 400);
    ctx.lineTo(600, 400);
    ctx.stroke();
  }
  drawMarks = () => {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board[i][j] === 'x') ctx.fillStyle = 'red';
        else ctx.fillStyle = 'green';
        ctx.fillText(board[i][j], 60+j*200, 135+i*200);
      }
    }
  }
  redraw = () => {
    ctx.clearRect(0, 0, 600, 600);
    this.drawLines();
    this.drawMarks();
  }
  handleClick = (event) => {
    var offX = canvas.offsetLeft;
    var offY = canvas.offsetTop;
    var i = Math.floor((event.clientY-offY) / 200);
    var j = Math.floor((event.clientX-offX) / 200);
    if (board[i][j] !== '') {
      console.log('square already taken');
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
    if (this.checkWinner()) {
      canvas.onclick = canvas.ontouchstart = null;
      console.log('You Win!');
    }
  }
  componentDidMount() {
    this.initVariables();
    canvas.onclick = canvas.ontouchstart = this.handleClick;
    this.redraw();
  }
  render() {
    return(
      <canvas ref={this.cref} width='600' height='600'>
        canvas not supported in your browser
      </canvas>
    );
  }
}

export default TicTacToe;
