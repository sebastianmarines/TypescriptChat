import React, { Component } from "react";
import { Container } from "reactstrap";
import CSS from "csstype";
import io, { Socket } from "socket.io-client";

import Header from "./components/Header";
import Messages from "./components/Messages";
import MessageBox from "./components/MessageBox";
import LogIn from "./components/LogIn";

import IMessage from "./interfaces/Message.interface";

export default class App extends Component {
  state: Readonly<State> = {
    messages: [],
    name: "",
    socket: io("http://localhost:4000", { autoConnect: false })
  };

  connect = (name: string) => {
    this.state.socket.connect();
    this.state.socket.emit("update name", name);
    this.setState({
      name: name
    })
  }

  componentDidMount = () => {
    this.state.socket.on("new connection", (name: string) => {
      // this.new_connection.name = name;
      // this.new_connection.connection = true;
      // this.new_connection.status = true;
      // setTimeout(() => this.resetNewConnection(), 5000);
      console.log(name)
    });
    this.state.socket.on("new message", (data: IMessage) => {
      this.setState((prevState: State) => ({
        messages: [...prevState.messages, data]
      }))
    });
  }

  render() {
    return (
      <div>
        <Header name={this.state.name} />
        <Container className="mt-3">
          {this.state.name ? (
            <div style={style.div}>
              <Messages messages={this.state.messages} />
              <MessageBox />
            </div>
          ) : (
            <LogIn connectHandler={this.connect}/>
          )}
        </Container>
      </div>
    );
  }
}

interface State {
  messages: IMessage[];
  name: string;
  socket: SocketIOClient.Socket;
}

let style: { [id: string]: CSS.Properties } = {
  div: {
    border: "5px solid #343a40",
    borderRadius: "5px",
    height: "85vh",
    position: "relative",
  },
};
