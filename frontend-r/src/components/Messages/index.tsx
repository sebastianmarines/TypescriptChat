import React, { Component } from "react";

import IMessage from "../../interfaces/Message.interface";
import { Container, Row, Col } from "reactstrap";
import Message from '../Message'

import './messages.css'

export default class Messages extends Component<MessagesProps, {}> {
  render() {
    let messages = this.props.messages
    return (
      <Container className="message-container">
        {messages.map((message) => (
          <Message message={message} key={message.id}/>
        ))}
      </Container>
    );
  }
}

interface MessagesProps {
  messages: IMessage[];
}
