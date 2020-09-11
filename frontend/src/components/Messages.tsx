import React, { Component } from "react";

import IMessage from "../interfaces/Message.interface";
import { Container } from "reactstrap";
import CSS from "csstype";

import Message from "./Message";

export default class Messages extends Component<MessagesProps, {}> {
  render() {
    let messages = this.props.messages;
    return (
      <Container style={style.container}>
        {messages.map((message) => (
          <Message message={message} key={message.id} />
        ))}
      </Container>
    );
  }
}

interface MessagesProps {
  messages: IMessage[];
}

let style: { [id: string]: CSS.Properties } = {
  container: {
    overflowY: "scroll",
    height: "90%",
    display: "flex",
    flexDirection: "column-reverse"
  }
};
