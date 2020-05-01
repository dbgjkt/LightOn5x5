import React from "react";

export function shuffle(array) {
  // return a random ordered array
  for (let i = array.length - 1; i > 0; i--) {
    let j = getRandomInt(i);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function getRandomInt(max) {
  // return an integer between 0 to max-1
  return Math.floor(Math.random() * max);
}

function NumberBox(props) {
  return (
    <input
      className="numberBox"
      id={props.id}
      type="number"
      min="1"
      max={props.max}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

function ButtonPlus(props) {
  return (
    <button
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    >
      +
    </button>
  );
}

function ButtonMinus(props) {
  return (
    <button
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    >
      -
    </button>
  );
}

export class NumberBoxPM extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: parseInt(this.props.value, 10)
    };
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  stepPlus(i) {
    const value = parseInt(this.state.value, 10);
    if ((value < this.props.max && i > 0) || (value > 1 && i < 0)) {
      const newValue = value + parseInt(i, 10);
      this.setState({ value: newValue });
    }
  }

  keepPlus(i) {
    this.timerIDPlus = setInterval(() => this.stepPlus(i), 100);
  }

  stopPlus() {
    clearInterval(this.timerIDPlus);
  }

  render() {
    return (
      <div className="numberBoxPM">
        <NumberBox
          id={this.props.id}
          max={this.props.max}
          value={this.state.value}
          onChange={e => this.onChange(e)}
        />
        <ButtonPlus
          onClick={() => this.stepPlus(1)}
          onMouseDown={() => this.keepPlus(1)}
          onMouseUp={() => this.stopPlus()}
        />
        <ButtonMinus
          onClick={() => this.stepPlus(-1)}
          onMouseDown={() => this.keepPlus(-1)}
          onMouseUp={() => this.stopPlus()}
        />
      </div>
    );
  }
}
