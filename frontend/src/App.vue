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
        <input type="text" class="form-control" placeholder="Name" v-model="name" />
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
import { Message } from "./interfaces";

@Options({
  components: {
    Header,
  },
})
export default class App extends Vue {
  private socket: SocketIOClient.Socket = io({ autoConnect: false });
  private message = "";
  private messages: Message[] = [];
  private id_count = 0;
  private name = "";
  private connected = false;

  // created() {}

  public async updateName() {
    if (!this.name) return;
    this.socket = await io("http://localhost:4000");
    this.socket.emit("update name", this.name);
    if (this.socket) this.connected = true;
    this.socket.on("new message", (data: string) => {
      this.messages.push({
        content: data,
        id: this.id_count,
      });
      this.id_count++;
    });
  }

  public sendMessage() {
    if (this.message === "" || !this.connected) return;
    this.socket.emit("message", this.message);
    this.message = "";
  }
}
</script>

<style lang="scss"></style>
