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
    </div>
</template>

<script>
import { login } from "@/services"

export default {

    data(){
        return{
            email:"",
            password:""
        }
    },

    methods:{
        async login(form){
            form.preventDefault();
            let response = await login({email: this.email, password: this.password, returnSecureToken: true});
            if (response) {
                this.emitter.emit("userValid", true);
                this.$router.push('home');
            }
        },
    }

}
</script>

<style>

</style>