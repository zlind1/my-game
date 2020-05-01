import React from 'react';

let canvas, ctx, s, food;

function randPos() {
  return [Math.floor(Math.random()*20), Math.floor(Math.random()*20)]
}
function clearScreen() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 400, 400);
}
function drawFood() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(food[0]*20, food[1]*20, 20, 20);
}
function drawNode(node) {
  ctx.fillStyle = 'red';
  ctx.fillRect(node.x*20, node.y*20, 20, 20);
  if (node.next != null) drawNode(node.next);
}
function drawLines() {
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  for (var i = 1; i < 20; i++) {
    ctx.moveTo(i*20, 0);
    ctx.lineTo(i*20, 400);
    ctx.moveTo(0, i*20);
    ctx.lineTo(400, i*20);
  }
  ctx.stroke();
}

class SnakeObj {
  constructor(incLength, reset) {
    this.incLength = incLength;
    this.reset = reset;
    this.head = {
      x: 10,
      y: 10,
      next: null,
      prev: null
    }
    this.head.prev = this.head
    this.dir = Math.floor(Math.random()*4);
    this.nextdir = this.dir;
  }
  move = () => {
    var newx = this.head.x;
    var newy = this.head.y;
    if (this.dir === 0) {
      newy--;
    } else if (this.dir === 1) {
      newx++;
    } else if (this.dir === 2) {
      newy++;
    } else if (this.dir === 3) {
      newx--;
    }
    var newhead = {
      x: newx,
      y: newy,
      next: this.head,
      prev: this.head.prev
    }
    this.head.prev = newhead;
    this.head = newhead;
    if (newx === food[0] && newy === food[1]) {
      food = randPos();
      this.incLength();
    } else {
      this.head.prev = this.head.prev.prev;
      this.head.prev.next = null;
    }
  }
  checkCollision = () => {
    var selfCollide = false;
    var headx = this.head.x;
    var heady = this.head.y;
    for (var node = this.head; node.next != null; node = node.next) {
      if (node.next.x === headx && node.next.y === heady) {
        selfCollide = true;
        break;
      }
    }
    return (headx < 0 || headx > 19 || heady < 0 || heady > 19 || selfCollide);
  }
  update = () => {
    this.dir = this.nextdir;
    this.move();
    if (this.paused) {
      return;
    } else if (this.checkCollision()) {
      alert('Oh no! you died :(');
      this.reset();
    } else {
      clearScreen();
      drawFood();
      drawNode(this.head);
      drawLines();
      setTimeout(this.update, 1000/6);
    }
  }
}

function handleKeydown(event) {
  console.log('key press');
  if (event.key === 'ArrowUp') {
    if (s.dir !== 2) s.nextdir = 0;
  } else if (event.key === 'ArrowRight') {
    if (s.dir !== 3) s.nextdir = 1;
  } else if (event.key === 'ArrowDown') {
    if (s.dir !== 0) s.nextdir = 2;
  } else if (event.key === 'ArrowLeft') {
    if (s.dir !== 1) s.nextdir = 3;
  }
}

class Snake extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      length: 0,
    }
  }
  incLength = () => {
    this.setState({length: this.state.length+1});
  }
  reset = () => {
    food = randPos();
    s = new SnakeObj(this.incLength, this.reset);
    this.setState({length: 1});
    s.update();
  }
  componentDidMount() {
    canvas = this.canvasRef.current;
    ctx = canvas.getContext('2d');
    this.reset();
    window.onkeydown = handleKeydown;
  }
  componentWillUnmount() {
    s.paused = true;
  }
  render() {
    return (
      <div>
        <canvas ref={this.canvasRef} width='400' height='400'>
          canvas not supported in your browser
        </canvas>
        <h1>Your length: {this.state.length}</h1>
      </div>
    );
  }
}

export default Snake;
