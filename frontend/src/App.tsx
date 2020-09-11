import React, { Component } from "react";
import { Container, ToastHeader, Toast, ToastBody, Badge } from "reactstrap";
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
    socket: io("http://localhost:4000", { autoConnect: false }),
    toast: {
      isOpen: false,
      status: false,
      name: "",
    },
    room: "",
  };

  showToast = (name: string, status: boolean) => {
    this.setState({
      toast: {
        isOpen: true,
        status: status,
        name: name,
      },
    });
    setTimeout(() => {
      this.setState({ toast: { isOpen: false } });
    }, 5000);
  };

  connect = (name: string, room: string) => {
    this.state.socket.connect();
    this.state.socket.emit("login", name, room);
    this.setState({
      name: name,
      room: room,
    });
  };

  sendMessage = (message: string) => {
    this.state.socket.emit("message", message);
  };

  componentDidMount = () => {
    this.state.socket.on("new connection", (name: string) => {
      this.showToast(name, true);
    });
    this.state.socket.on("someone disconnected", (name: string) => {
      this.showToast(name, false);
    });
    this.state.socket.on("new message", (data: IMessage) => {
      this.setState((prevState: State) => ({
        messages: [data, ...prevState.messages],
      }));
    });
    this.state.socket.on("past messages", (data: IMessage[]) => {
      this.setState({
        messages: [...data]
      })
    })
  };

  render() {
    return (
      <div>
        <Header name={this.state.name} />
        <Container className="mt-3">
          {this.state.name ? (
            <Container>
              <Container className="d-flex justify-content-end py-1">
                <Badge color="primary">
                  <span>
                    Connected to room{" "}
                    <span className="font-weight-bold">"{this.state.room}"</span>
                  </span>
                </Badge>
              </Container>
              <div style={style.div}>
                <Messages messages={this.state.messages} />
                <MessageBox sendHandler={this.sendMessage} />
              </div>
            </Container>
          ) : (
            <LogIn connectHandler={this.connect} />
          )}
        </Container>
        <div className="p-3 my-2 rounded" style={style.toast}>
          <Toast isOpen={this.state.toast.isOpen}>
            <ToastHeader>
              {this.state.toast.status
                ? "New connection"
                : "Someone disconnected"}
            </ToastHeader>
            <ToastBody>
              <span className="font-weight-bold">{this.state.toast.name}</span>
              {this.state.toast.status ? " connected." : " disconnected."}
            </ToastBody>
          </Toast>
        </div>
      </div>
    );
  }
}

interface State {
  messages: IMessage[];
  name: string;
  socket: SocketIOClient.Socket;
  toast: {
    isOpen: boolean;
    status: boolean; // connect or disconnect
    name: string;
  };
  room: string;
}

let style: { [id: string]: CSS.Properties } = {
  div: {
    border: "5px solid #343a40",
    borderRadius: "5px",
    height: "85vh",
    position: "relative",
  },
  toast: {
    position: "absolute",
    top: "2em",
    right: "1em",
    zIndex: 1000000,
  },
};
