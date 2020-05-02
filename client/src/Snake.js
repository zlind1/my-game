import React from 'react';
import {Container} from 'react-bootstrap';

let container, canvas, ctx, s, food, cellSize, length;

function randPos() {
  return [Math.floor(Math.random()*20), Math.floor(Math.random()*20)]
}
function clearScreen() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawFood() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(food[0]*cellSize, food[1]*cellSize, cellSize, cellSize);
}
function drawNode(node) {
  ctx.fillStyle = 'red';
  ctx.fillRect(node.x*cellSize, node.y*cellSize, cellSize, cellSize);
  if (node.next != null) drawNode(node.next);
}
function drawLines() {
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  for (var i = 1; i < 20; i++) {
    ctx.moveTo(i*cellSize, 0);
    ctx.lineTo(i*cellSize, canvas.height);
    ctx.moveTo(0, i*cellSize);
    ctx.lineTo(canvas.width, i*cellSize);
  }
  ctx.stroke();
}

class SnakeObj {
  constructor(reset) {
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
      length++;
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
  redraw = () => {
    clearScreen();
    drawFood();
    drawNode(this.head);
    drawLines();
  }
  update = () => {
    this.dir = this.nextdir;
    this.move();
    if (this.paused) {
      return;
    } else if (this.checkCollision()) {
      alert('Oh no! you died :(\nYou got to length '+length);
      this.reset();
    } else {
      this.redraw();
      setTimeout(this.update, 1000/6);
    }
  }
}

function handleKeydown(event) {
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
    this.containerRef = React.createRef();
    this.canvasRef = React.createRef();
  }
  reset = () => {
    food = randPos();
    s = new SnakeObj(this.reset);
    length = 1;
    s.update();
  }
  handleResize = () => {
    let min = (a, b) => (a < b ? a : b);
    canvas.width = min(container.offsetWidth-32, window.innerHeight-32);
    canvas.height = canvas.width;
    cellSize = canvas.width/20;
    ctx.lineWidth = canvas.width/120;
    s.redraw();
  }
  componentDidMount() {
    document.title = 'Snake Game';
    canvas = this.canvasRef.current;
    container = this.containerRef.current;
    ctx = canvas.getContext('2d');
    this.reset();
    this.handleResize();
    window.onresize = this.handleResize;
    window.onkeydown = handleKeydown;
  }
  componentWillUnmount() {
    s.paused = true;
  }
  render() {
    return (
      <Container ref={this.containerRef} className='d-flex justify-content-center p-3'>
        <canvas ref={this.canvasRef} width='400' height='400'>
          canvas not supported in your browser
        </canvas>
      </Container>
    );
  }
}

export default Snake;
