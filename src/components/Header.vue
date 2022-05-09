<template>
    <header>
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
            <li>
              <button @click="test">TEST</button>
            </li>
        </ul>
        <div v-if="user==true" class="collapse navbar-collapse justify-content-end" id="userMenu">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" id="profile" href="#">{{username}}</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" @click="logout">Logout</a>
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
export default {
  inject: ['user'],
    data(){
        return{
        }
    },
    methods:{
      test(){
        console.log(this.user);
      }
    }
}
</script>

<style>

</style>