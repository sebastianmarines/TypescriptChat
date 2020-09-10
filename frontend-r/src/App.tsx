import React, { Component } from "react";
import { Container } from "reactstrap";

import Header from './components/Header'
import Messages from './components/Messages/index'

import IMessage from './interfaces/Message.interface'

export default class App extends Component {
  state: Readonly<State> = {
    messages: [
      {
        content: "hello",
        id: "1",
        sender: "Sebastian",
        sender_id: "ansda",
        timestamp: "12:46"
      },
      {
        content: "hello",
        id: "2",
        sender: "Sebastian",
        sender_id: "ansda",
        timestamp: "12:46"
      },
      {
        content: "hello",
        id: "3",
        sender: "Sebastian",
        sender_id: "ansda",
        timestamp: "12:46"
      },
      {
        content: "hello",
        id: "4",
        sender: "Sebastian",
        sender_id: "ansda",
        timestamp: "12:46"
      }
    ]
  }

  render() {
    return <div>
      <Header name="Sebastian"/>
      <Container className="mt-3">
        <Messages messages={this.state.messages}/>
      </Container>
    </div>;
  }
}


interface State {
  messages: IMessage[]
}