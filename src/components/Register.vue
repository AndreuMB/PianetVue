<template>
    <div class="container p-5">
    <form method="POST">
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" name="username"/>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control" name="email"/>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" name="password"/>
        </div>
        <button type="button" @click="register" class="btn btn-primary">Register</button>
    </form>
    </div>
</template>

<script>
export default {

methods:{
    register(){
        console.log("enter register");
        console.log(this.registerForm.value);
    
        this.registerService.registerAuth(this.registerForm.value).subscribe(datos=>{
            console.log(datos);
            // let data2 = {"user": this.user, "email":this.email}
            this.registerService.registerDB(this.registerForm.value).subscribe(datos=>{
                console.log(datos);
                this.router.navigate(['/login']);
            })
        })
    }
}

}
</script>

<style>

</style>