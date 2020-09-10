import React, { Component } from "react";
import CSS from "csstype";

import { InputGroup, InputGroupAddon, Button, Input } from "reactstrap";

export default class MessageBox extends Component {
  render() {
    return (
      <InputGroup style={style} className="p-3">
        <Input />
        <InputGroupAddon addonType="append">
          <Button color="secondary">To the Right!</Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}

let style: CSS.Properties = {
  position: "absolute",
  left: 0,
  bottom: 0
};
