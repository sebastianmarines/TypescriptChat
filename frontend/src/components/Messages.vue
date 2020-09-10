<template>
  <div class="container">
    <div
      class="row d-flex flex-row my-2 border-bottom p-2"
      v-for="message in messages"
      :key="message.id"
    >
      <div>
        <span class="font-weight-bold">{{ message.sender }}:</span>
        {{ message.content }}
      </div>
      <span class="ml-auto"
        ><p class="small text-muted">{{ message.timestamp }}</p></span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { IncomingMessage } from "../interfaces";

export default class Messages extends Vue{
  @Prop()
  messages!: IncomingMessage[];

};
</script>
