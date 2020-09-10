import React, { Component } from "react";
import { Container } from "reactstrap";

import Header from './components/Header'

export default class App extends Component {
  render() {
    return <div>
      <Header name="Sebastian"/>
      <Container>
        <h1>hi</h1>
      </Container>
    </div>;
  }
}
