import React, { Component, ChangeEvent } from "react";
import { Button, Input, Row, Col } from "reactstrap";

export default class LogIn extends Component<LogInProps, {}> {
  state: Readonly<State> = {
    name: "",
    room: "",
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const value = event.target.value;
    const name = event.target.name;
    if (name === "room" && value.length > 5) return;
    this.setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  handleConnect = () => {
    this.props.connectHandler(this.state.name, this.state.room);
  };

  render() {
    return (
      <Row>
        <Col xs="12" md="6">
          <Input
            placeholder="Enter your name"
            value={this.state.name}
            onChange={this.handleChange}
            name="name"
            className="m-2 m-md-0"
          />
        </Col>
        <Col xs="12" md="4">
          <Input
            placeholder="Room"
            value={this.state.room}
            onChange={this.handleChange}
            name="room"
            className="m-2 m-md-0"
          />
        </Col>
        <Col xs="12" md="2">
          <Button color="success" onClick={this.handleConnect} disabled={!this.state.name || !this.state.room}>
            Connect!
          </Button>
        </Col>
      </Row>
    );
  }
}

interface State {
  name: string;
  room: string;
}

interface LogInProps {
  connectHandler: (name: string, room: string) => void;
}
