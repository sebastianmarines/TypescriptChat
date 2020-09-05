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

  // created() {}

  public async updateName() {
    if (!this.name) return;
    this.socket = await io("http://localhost:4000");
    this.socket.emit("update name", this.name);
    if (this.socket) this.connected = true;
    this.socket.on("new message", (data: IncomingMessage) => {
      this.messages.push(data);
    });
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
