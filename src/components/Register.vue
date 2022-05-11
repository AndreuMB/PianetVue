<template>
    <div class="container p-5">
    <form method="POST" ref="form_login" @submit="register">
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" v-model="username" required/>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control" v-model="email" 
            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            required
            />
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" minlength="6" v-model="password" required/>
        </div>
        <button  type="submit" class="btn btn-primary">Register</button>
    </form>
    </div>
</template>

<script>
import { registerAuth } from "@/services"

export default {
    data(){
        return{
            // user: false,
        }
    },

    methods:{
        
        async register(event){
            event.preventDefault();
            let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCFfIeHfupYXw89FUOMeorhfQrndz7iIck";
            await registerAuth(url,
                {username: this.username, email: this.email, password: this.password}
            );
            this.$router.push('login');
        }
    }

}
</script>

<style>

</style>