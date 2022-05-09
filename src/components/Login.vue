<template>
    <div class="container p-5">
        <form method="POST" @submit="login">
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" v-model="email" 
                required
                pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password" required/>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <button @click="testtt">dsaf</button>
    </div>
</template>

<script>
import { login } from "@/services"
export default {

  

    computed:{
        getUser(){
            return this.user;
        }
    },

    methods:{
        async login(form){
            form.preventDefault();
            await login({email: this.email, password: this.password, returnSecureToken: true});
            this.$router.push('home');
        },
        testtt(){
            console.log(this.user);
            app.provide('user', true)
        }
    }

}
</script>

<style>

</style>