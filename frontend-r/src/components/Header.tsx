import { Navbar, NavbarBrand } from "reactstrap";

import React, { Component } from "react";

export default class Header extends Component {
  render() {
    return (
      <Navbar color="dark" dark className="p-3">
        <NavbarBrand a>Chat</NavbarBrand>
      </Navbar>
    );
  }
}
