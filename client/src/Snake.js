import React from 'react';
import {Container} from 'react-bootstrap';

let container, canvas, ctx;
let head, dir, nextdir, food, length;
let cellSize, paused;

class Snake extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.canvasRef = React.createRef();
  }
  randPos = () => {
    return [Math.floor(Math.random()*20), Math.floor(Math.random()*20)]
  }
  reset = () => {
    food = this.randPos();
    head = {
      x: 10, y: 10, next: null, prev: null
    }
    head.prev = head;
    dir = nextdir = Math.floor(Math.random()*4);
    length = 1;
  }
  initVariables = () => {
    container = this.containerRef.current;
    canvas = this.canvasRef.current;
    ctx = canvas.getContext('2d');
    this.reset();
  }
  clearScreen = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  drawFood = () => {
    ctx.fillStyle = 'blue';
    ctx.fillRect(food[0]*cellSize, food[1]*cellSize, cellSize, cellSize);
  }
  drawNode = (node) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(node.x*cellSize, node.y*cellSize, cellSize, cellSize);
    if (node.next != null) this.drawNode(node.next);
  }
  drawLines = () => {
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
  redraw = () => {
    this.clearScreen();
    this.drawFood();
    this.drawNode(head);
    this.drawLines();
  }
  move = () => {
    var newx = head.x;
    var newy = head.y;
    if (dir === 0) newy--;
    else if (dir === 1) newx++;
    else if (dir === 2) newy++;
    else if (dir === 3) newx--;
    var newhead = {
      x: newx, y: newy, next: head, prev: head.prev
    }
    head.prev = newhead;
    head = newhead;
    if (newx === food[0] && newy === food[1]) {
      food = this.randPos();
      length++;
    } else {
      head.prev = head.prev.prev;
      head.prev.next = null;
    }
  }
  checkCollision = () => {
    var selfCollide = false;
    for (var node = head; node.next != null; node = node.next) {
      if (node.next.x === head.x && node.next.y === head.y) {
        selfCollide = true;
        break;
      }
    }
    return (head.x < 0 || head.x > 19 || head.y < 0 || head.y > 19 || selfCollide);
  }
  update = () => {
    if (paused) return;
    dir = nextdir;
    this.move();
    if (this.checkCollision()) {
      alert('Oh no! you died :(\nYou got to length '+length);
      this.reset();
      this.update();
    } else {
      this.redraw();
      setTimeout(this.update, 1000/6);
    }
  }
  handleResize = () => {
    let min = (a, b) => (a < b ? a : b);
    canvas.width = min(container.offsetWidth-32, window.innerHeight-32);
    canvas.height = canvas.width;
    cellSize = canvas.width/20;
    ctx.lineWidth = canvas.width/120;
    this.redraw();
  }
  handleKeydown = (event) => {
    if (event.key === 'ArrowUp') {
      if (dir !== 2) nextdir = 0;
    } else if (event.key === 'ArrowRight') {
      if (dir !== 3) nextdir = 1;
    } else if (event.key === 'ArrowDown') {
      if (dir !== 0) nextdir = 2;
    } else if (event.key === 'ArrowLeft') {
      if (dir !== 1) nextdir = 3;
    }
  }
  componentDidMount() {
    document.title = 'Snake Game';
    this.initVariables();
    this.handleResize();
    window.onresize = this.handleResize;
    window.onkeydown = this.handleKeydown;
    this.update();
  }
  componentWillUnmount() {
    paused = true;
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
