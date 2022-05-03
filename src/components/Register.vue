<template>
    <div class="container p-5">
    <form method="POST" @submit="register">
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" v-model="username" required/>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control" v-model="email" required/>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" v-model="password" required/>
        </div>
        <button  type="submit" class="btn btn-primary">Register</button>
    </form>
    </div>
</template>

<script>
import { signIn } from "@/services"
export default {
    data(){
        return{
            // user: false,
        }
    },

    methods:{
        register(event){
            event.preventDefault();
            console.log("enter register");
            console.log(this.username);
            console.log(signIn);
            // this.registerService.registerAuth(this.registerForm.value).subscribe(datos=>{
            //     console.log(datos);
            //     // let data2 = {"user": this.user, "email":this.email}
            //     this.registerService.registerDB(this.registerForm.value).subscribe(datos=>{
            //         console.log(datos);
            //         this.router.navigate(['/login']);
            //     })
            // })
        }
    }

}
</script>

<style>

</style>