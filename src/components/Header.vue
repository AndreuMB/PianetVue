<template>
    <header ref="header">
      <div class="navbar navbar-expand navbar-light bg-light" id="navbarNav">
        <a class="navbar-brand" href="#">Pianet</a>
        <ul class="navbar-nav">
            <li class="nav-item">
                <router-link class="nav-link" to="/home">Home</router-link>
            </li>
            <li v-if="user" class="nav-item">
                <a class="nav-link" >My Sheets</a>
            </li>
            <li class="nav-item">
                <a class="nav-link">Compose</a>
            </li>
        </ul>
        <div v-if="user" class="collapse navbar-collapse justify-content-end" id="userMenu">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" id="profile" href="#">{{username}}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" @click="logoutHeader">Logout</a>
              </li>
            </ul>
        </div>
        <div v-else class="collapse navbar-collapse justify-content-end" id="userMenu">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="logout_link" href="/register">Register</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
</template>

<script>
import { logout } from "@/services"

export default {
  beforeMount() {
    if (localStorage.getItem('idToken')){
      console.log("idtoken = " + localStorage.getItem('idToken'));
      this.user = true;
    }
    this.emitter.on("userValid", valid => {
      this.user = valid;
      console.log("this.user = " + this.user);
      this.$forceUpdate();
    });
  },
  data(){
      return{
        // user: this.getUser(),
      }
  },

  computed: {

    // getUser(){
    //   return     this.$root.$on('validationUser', data => {
    //     console.log(data);
    // });
    // }
  },

  methods:{
    logoutHeader(){
      logout();
      this.emitter.emit("userValid", false);
      this.$forceUpdate();
    }
  }
}
</script>

<style>

</style>