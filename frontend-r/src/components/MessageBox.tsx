import React, { Component } from "react";
import CSS from "csstype";

import { InputGroup, InputGroupAddon, Button, Input } from "reactstrap";

export default class MessageBox extends Component {
  render() {
    return (
      <InputGroup style={style} className="p-3">
        <Input />
        <InputGroupAddon addonType="append">
          <Button color="info">Send</Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}

let style: CSS.Properties = {
  position: "absolute",
  left: 0,
  bottom: 0,
  borderTop: "3px solid #6c6c6d",
};
