<template>
  <div>
    <Header />
    <div class="container-fluid">
      <div class="jumbotron">{{ message }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "./components/Header.vue";

import io, { Socket } from "socket.io-client";

@Options({
  components: {
    Header
  }
})
export default class App extends Vue {
  private socket: SocketIOClient.Socket = io("http://localhost:4000");
  private message = "hello";

  created() {
    this.socket.on("add-users", (data: string) => {
      this.message = data;
    });
  }
}
</script>

<style lang="scss"></style>
