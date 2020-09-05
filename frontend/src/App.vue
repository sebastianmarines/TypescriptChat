<template>
  <div>
    <Header />
    <div class="container" v-if="connected">
      <div class="jumbotron mt-4">Welcome to the chat {{ name }}</div>
      <div>
        <p v-for="message in messages" :key="message.id">
          {{ message.content }}
        </p>
      </div>
      <div class="input-group mb-3">
        <input type="text" class="form-control" v-model="message" />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="sendMessage"
          >
            Send
          </button>
        </div>
      </div>
    </div>
    <div v-else class="container jumbotron mt-4">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          placeholder="Name"
          v-model="name"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="updateName"
          >
            Connect!
          </button>
        </div>
      </div>
    </div>
    <div class="toast" style="position: absolute; top: 2em; right: 1em;" :class="new_connection.status ? 'show' : 'hide'">
      <div class="toast-header">
        <strong class="mr-auto">New connection</strong>
        <small>Now</small>
      </div>
      <div class="toast-body">
        {{new_connection.name}} just connected
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "./components/Header.vue";

import io, { Socket } from "socket.io-client";
import { IncomingMessage, OutMessage } from "./interfaces";

@Options({
  components: {
    Header,
  },
})
export default class App extends Vue {
  private socket: SocketIOClient.Socket = io({ autoConnect: false });
  private message = "";
  private messages: IncomingMessage[] = [];
  private name = "";
  private connected = false;
  private new_connection = {
    status: false,
    name: ""
  };

  // created() {}

  public resetNewConnection() {
    this.new_connection.status = false
    this.new_connection.name = ""
  }

  public async updateName() {
    if (!this.name) return;
    this.socket = await io("http://localhost:4000");
    this.socket.emit("update name", this.name);
    if (this.socket) this.connected = true;
    this.socket.on("new message", (data: IncomingMessage) => {
      this.messages.push(data);
    });
    this.socket.on("new connection", (name: string) => {
      this.new_connection.name = name
      this.new_connection.status = true
      setTimeout(()=>this.resetNewConnection(), 5000)
    })
  }

  public sendMessage() {
    if (this.message === "" || !this.connected) return;
    const _message: OutMessage = {
      content: this.message,
    };
    this.socket.emit("message", _message);
    this.message = "";
  }
}
</script>

<style lang="scss"></style>
