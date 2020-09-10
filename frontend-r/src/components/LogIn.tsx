import React, { Component, ChangeEvent } from "react";
import { InputGroup, InputGroupAddon, Button, Input } from "reactstrap";

export default class LogIn extends Component<LogInProps, {}> {
  state: Readonly<State> = {
    name: "",
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  handleConnect = () => {
    this.props.connectHandler(this.state.name);
  };

  render() {
    return (
      <InputGroup>
        <Input
          placeholder="Enter your name"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <InputGroupAddon addonType="append">
          <Button color="success" onClick={this.handleConnect}>
            Connect!
          </Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}

interface State {
  name: string;
}

interface LogInProps {
  connectHandler: (name: string) => void;
}
