<template>
  <div class="jumbotron mt-4">Welcome to the chat {{ name }}</div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class Jumbotron extends Vue {
  @Prop(String)
  name: string;
}
</script>
