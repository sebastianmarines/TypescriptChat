import React, { Component } from "react";
import { Container } from "reactstrap";
import CSS from "csstype";

import Header from "./components/Header";
import Messages from "./components/Messages";
import MessageBox from "./components/MessageBox";

import IMessage from "./interfaces/Message.interface";

export default class App extends Component {
  state: Readonly<State> = {
    messages: [
      {
        content: "hello",
        id: "1",
        sender: "Sebastian",
        sender_id: "ansda",
        timestamp: "12:46",
      },
      {
        content: "hello",
        id: "2",
        sender: "Sebastian",
        sender_id: "ansda",
        timestamp: "12:46",
      },
      {
        content: "hello",
        id: "3",
        sender: "Sebastian",
        sender_id: "ansda",
        timestamp: "12:46",
      },
      {
        content: "hello",
        id: "4",
        sender: "Sebastian",
        sender_id: "ansda",
        timestamp: "12:46",
      },
    ],
  };

  render() {
    return (
      <div>
        <Header name="Sebastian" />
        <Container className="mt-3">
          <div style={style.div}>
            <Messages messages={this.state.messages} />
            <MessageBox />
          </div>
        </Container>
      </div>
    );
  }
}

interface State {
  messages: IMessage[];
}

let style: { [id: string]: CSS.Properties } = {
  div: {
    border: "5px solid #343a40",
    borderRadius: "5px",
    height: "85vh",
    position: "relative",
  },
};
