import React, { Component, ChangeEvent } from "react";
import CSS from "csstype";

import { InputGroup, InputGroupAddon, Button, Input } from "reactstrap";

export default class MessageBox extends Component<MessageBoxProps, {}> {
  state: Readonly<State> = {
    message: "",
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ message: event.target.value });
  };

  handleMessage = () => {
    const message = this.state.message;
    this.props.sendHandler(message);
    this.setState({ message: "" });
  };

  render() {
    return (
      <InputGroup style={style} className="p-3">
        <Input value={this.state.message} onChange={this.handleChange} />
        <InputGroupAddon addonType="append">
          <Button color="info" onClick={this.handleMessage}>
            Send
          </Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}

interface MessageBoxProps {
  sendHandler: (message: string) => void;
}

interface State {
  message: string;
}

let style: CSS.Properties = {
  position: "absolute",
  left: 0,
  bottom: 0,
  borderTop: "3px solid #6c6c6d",
};
