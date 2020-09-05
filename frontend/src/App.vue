<template>
  <div>
    <Header />
    <div class="container-fluid">
      <div class="jumbotron">{{ message }}</div>
      <h2>{{my_message}}</h2>
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          v-model="my_message"
        />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="sendMessage"> 
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

@Options({
  components: {
    Header,
  },
})
export default class App extends Vue {
  private socket: SocketIOClient.Socket = io("http://localhost:4000");
  private message = "hello";
  private my_message = "";

  created() {
    this.socket.on("add-users", (data: string) => {
      this.message = data;
    });
  }

  public sendMessage() {
    if (this.my_message === "") return;
    this.socket.emit("message", "Hello from vue")
  }
}
</script>

<style lang="scss"></style>
