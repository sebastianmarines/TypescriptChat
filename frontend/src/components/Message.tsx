import React, { Component } from "react";

import IMessage from "../interfaces/Message.interface";
import { Row, Col } from "reactstrap";

export default class Message extends Component<MessageProps, {}> {
  render() {
    let { content, sender, timestamp} = this.props.message;
    return (
      <Row className="my-2 border-bottom p-2">
        <Col xs="10" md="11">
          <span className="font-weight-bold">{sender}: </span>
          <span>{content}</span>
        </Col>
        <Col xs="1">
          <span className="small text-muted">{timestamp}</span>
        </Col>
      </Row>
    );
  }
}
type MessageProps =  {
    message: IMessage;
}
