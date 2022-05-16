<template>
  <h1 class="display-1 contental-center mb-5">MY SHEETS</h1>
    <label for="filter">Filter: </label>
    <input type="text" name="filter">

    <div class="m-2 d-flex justify-content-around">

        <div v-for="sheet of sheets" :key="sheet" class="card" style="width: 18rem;">
            <img :src="sheet.img" class="card-img-top img_card" alt="example-sheet">
            <div class="card-body bg-dark">
                <h5 class="card-title">{{ sheet.title }}</h5>
                <div class="d-flex justify-content-between">
                    <p class="card-text">{{ sheet.author }}</p>
                    <p class="card-text">{{ new Date(sheet.date).toLocaleDateString('es-EU') }}</p>
                </div>
                <a class="btn btn-primary" @click="editSheet(sheet.id)">Play</a>
                <a class="btn btn-danger" id="test" @click="deleteSheet(sheet.id)">Delete</a>
            </div>
        </div>

        <div class="card m-5" style="width: 18rem;">
            <div class="card-img-top size_img">
                <!-- <img class="img_card" src="assets/img/plus.png" alt="example-sheet"> -->
                <h1 style="color:black; text-align: center;">NEW SHEET</h1>
            </div>
            <div class="card-body bg-dark new_body">
                <form method="POST" @submit="newSheet" >
                    <div class="mb-3">
                        <input type="text" class="form-control" v-model="title" placeholder="title"
                            required
                        >
                    </div>
                    <button type="submit" class="btn btn-primary">New</button>
                </form>
            </div>
        </div>

    </div>
</template>

<script>
import { createSheet, getAllSheets, deleteSheet } from "@/services"
export default {
    async mounted(){
        this.sheets = await getAllSheets();
        console.log(this.sheets);
    },

    data(){
        return{
            sheets: [],
            title:""
        }
    },

    methods:{
        async newSheet(form){
            form.preventDefault();
            let response = await createSheet({ title:this.title });
            console.log("response createSheet= "+ response.name);
            localStorage.setItem("sheet", response.name);
            this.$router.push('compose');
        },
        

        async deleteSheet(id){
            console.log("delete", id);
            await deleteSheet(id);
            this.sheets = await getAllSheets();
        },

        editSheet(id){
            console.log("enter edit");
            localStorage.setItem("sheet" , id);
            this.$router.push('compose');
        }
    }

}
</script>

<style>

</style>