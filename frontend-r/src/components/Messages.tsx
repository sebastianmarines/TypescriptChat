import React, { Component } from "react";

import IMessage from "../interfaces/Message.interface";
import { Container } from "reactstrap";
import CSS from "csstype"

import Message from "./Message";
import MessageBox from "./MessageBox";

export default class Messages extends Component<MessagesProps, {}> {
  render() {
    let messages = this.props.messages;
    return (
      <div style={style}>
        <Container style={{overflowY: "scroll"}}>
          {messages.map((message) => (
            <Message message={message} key={message.id} />
          ))}
        </Container>
        <MessageBox />
      </div>
    );
  }
}

interface MessagesProps {
  messages: IMessage[];
}

let style: CSS.Properties = {
  border: "5px solid #343a40",
  borderRadius: "5px",
  height: "70vh",
  position: "relative"
}
