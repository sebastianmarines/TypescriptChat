<template>
  <div class="details">
    <div class="username">User: {{ nameUpperCase }}</div>
    <input :value="name" @keydown="updateName($event.target.value)" />
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component'
import { namespace } from 'vuex-class'
const user = namespace('user')

export default class User extends Vue {
  @user.State
  public name!: string

  @user.Getter
  public nameUpperCase!: string

  @user.Action
  public updateName!: (newName: string) => void
}
</script>