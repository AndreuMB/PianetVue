<template>
  <h1 class="display-1 contental-center mb-5">MY SHEETS</h1>
    <div class="row g-3 align-items-center">
        <div class="col-auto">
            <label for="filter" class="form-label">Filter: </label>
        </div>
        <div class="col-auto">
            <input type="text" class="form-control" v-model="search" @input="filteredList">
        </div>
    </div>

    <div class="d-flex justify-content-around row p-0">
        <div v-for="sheet of sheetsFilter" :key="sheet" class="card col-2 p-0 m-4">
            <img :src="sheet.img" class="card-img-top img_card" style="object-fit: cover; height:20em; object-position: 0 0;" alt="sheet">
            <div class="card-body bg-dark">
                <h5 class="card-title">{{ sheet.title }}</h5>
                <div class="d-flex justify-content-between">
                    <p class="card-text">{{ sheet.author }}</p>
                    <p class="card-text">{{ new Date(sheet.date).toLocaleDateString('es-EU') }}</p>
                </div>
                <div class="d-flex justify-content-between">
                    <a class="btn btn-primary" @click="editSheet(sheet.id)">Play</a>
                    <a class="btn btn-danger" @click="deleteSheet(sheet.id)">Delete</a>
                </div>
            </div>
        </div>
        <div class="card col-2 p-0 m-4 container_image">
            <img class="card-img-top img_card" :src="imgnew" alt="new-sheet">
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
import imgnewp from '@/assets/new_sheet.png'
export default {
    async mounted(){
        this.sheets = await getAllSheets() || [];
        this.sheetsFilter = this.sheets;
        // console.log("this,sheets",this.sheets);
        this.imgnew=imgnewp;
    },

    data(){
        return{
            sheets: [],
            sheetsFilter: [],
            title:"",
            search:"",
            imgnew:"",
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
                // params: {view : false}
            });
        },
        

        async deleteSheet(id){
            console.log("delete", id);
            await deleteSheet(id);
            this.sheets = await getAllSheets();
            await this.filteredList();
        },

        editSheet(id){
            console.log("enter edit");
            localStorage.setItem("sheet" , id);
            localStorage.removeItem('view');
            this.$router.push('compose');
        },
        async filteredList() {
            let arrayOfObj = Object.entries(this.sheets).map((e) => ( "e=",e[1]));
            
            arrayOfObj = arrayOfObj.filter(sheet => {
                return sheet.title.toLowerCase().includes(this.search)
            })
            console.log(arrayOfObj);
            this.sheetsFilter=arrayOfObj;
        }

        
    },

    computed:{
        
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