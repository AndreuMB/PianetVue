<template>
  <h1 class="display-1 contental-center mb-5">MY SHEETS</h1>
    <label for="filter">Filter: </label>
    <input type="text" name="filter">

    <div class="d-flex justify-content-around row p-0">
        <div v-for="sheet of sheets" :key="sheet" class="card col-2 p-0 m-4">
            <img :src="sheet.img" class="card-img-top img_card" style="object-fit: cover; height:20em; object-position: 0 0;" alt="sheet">
            <div class="card-body bg-dark">
                <h5 class="card-title">{{ sheet.title }}</h5>
                <div class="d-flex justify-content-between">
                    <p class="card-text">{{ sheet.author }}</p>
                    <p class="card-text">{{ new Date(sheet.date).toLocaleDateString('es-EU') }}</p>
                </div>
                <a class="btn btn-primary" @click="editSheet(sheet.id)">Play</a>
                <a class="btn btn-danger" @click="deleteSheet(sheet.id)">Delete</a>
            </div>
        </div>
        <div class="card col-2 p-0 m-4 container_image">
            <img class="card-img-top img_card" src="src/assets/new_sheet.svg" alt="new-sheet">
            <div class="centered">NEW SHEET</div>
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
        this.sheets = await getAllSheets() || [];
        // console.log("this,sheets",this.sheets);
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
            // console.log("response createSheet= " + response);
            localStorage.setItem("sheet", response);
            this.$router.push({
                name: 'compose',
                params: {view : false}
            });
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

.container_image {
  position: relative;
  text-align: center;
}

.centered {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-family: Lucida Handwriting;
  font-size: 4vw;
}

</style>