import { Navbar, NavbarBrand, NavbarText } from "reactstrap";

import React, { Component } from "react";

export default class Header extends Component<HeaderProps, {}> {
  render() {
    let { name } = this.props;
    return (
      <Navbar color="dark" dark className="p-3">
        <NavbarBrand>Chat</NavbarBrand>
        <NavbarText className="text-white">{name ? ("Welcome " + name) : ""}</NavbarText>
      </Navbar>
    );
  }
}

interface HeaderProps {
  name?: string;
}
