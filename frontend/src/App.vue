<template>
  <div>
    <Header />
    <div class="container">
      <div class="jumbotron mt-4">Welcome to the chat</div>
      <div>
        <p v-for="message in messages" :key="message.id">
          {{ message.content }}
        </p>
      </div>
      <div class="input-group mb-3">
        <input type="text" class="form-control" v-model="my_message" />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="sendMessage"
          >
            Button
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
import { Message } from './interfaces'

@Options({
  components: {
    Header,
  },
})
export default class App extends Vue {
  private socket: SocketIOClient.Socket = io("http://localhost:4000");
  private my_message = "";
  private messages: Message[] = []
  private id_count = 0;

  created() {
    this.socket.on("new_message", (data: string) => {
      this.messages.push({
        content: data,
        id: this.id_count
      })
      this.id_count++
    });
  }

  public sendMessage() {
    if (this.my_message === "") return;
    this.socket.emit("message", this.my_message);
  }
}
</script>

<style lang="scss"></style>
