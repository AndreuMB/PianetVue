<template>
    <header ref="header">
      <div class="navbar navbar-expand navbar-light bg-light" id="navbarNav">
        <a class="navbar-brand" href="#">Pianet</a>
        <ul class="navbar-nav">
            <li class="nav-item">
                <router-link class="nav-link" to="/home">Home</router-link>
            </li>
            <li v-if="user" class="nav-item">
                <router-link class="nav-link" to="/sheets">My Sheets</router-link>
            </li>
            <li class="nav-item">
                <div class="nav-link" @click="toCompose">Compose</div>
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
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
          </ul>
        </div>
      </div>
    </header>
</template>

<script>
import { logout, getUsername } from "@/services"

export default {
  async beforeMount() {
    if (localStorage.getItem('idToken')){
      this.user = true;
      this.username = localStorage.getItem('username');

    }
    if (localStorage.getItem('idToken')){
      if (await getUsername()==false) {
        console.log("enter logout");
        this.logoutHeader();
      }
    }
    this.emitter.on("userValid", valid => {
      this.user = valid;
      this.username = localStorage.getItem('username');
      console.log("this.user = " + this.user);
      this.$forceUpdate();
    });
  },

  async mounted(){

  },

  data(){
      return{
        // user: this.getUser(),
        username: "",
        user:""
      }
  },

  computed: {
  },

  methods:{
    async logoutHeader(){
      await logout();
      this.emitter.emit("userValid", false);
      this.$router.push('home');
    },
    toCompose(){
      localStorage.removeItem('sheet');
      this.$router.push('compose');
    }
  }
}
</script>

<style>

</style>