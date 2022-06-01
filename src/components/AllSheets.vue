<template>
    <div>
        <h1 class="display-1 contental-center">SHEETS</h1>
            <div class="row g-3 align-items-center">
                <div class="col-auto">
                    <label for="filter" class="form-label">Filter: </label>
                </div>
                <div class="col-auto">
                    <input type="text" class="form-control" v-model="search" @input="filteredList">
                </div>
                <div class="col-auto">
                    <label for="sort" class="form-label">Order by: </label>
                </div>
                <div class="col-auto">
                    <select class="form-select" v-model="sort" @change="sortBy">
                        <option value="views">Views</option>
                        <option value="score">Rating</option>
                        <option value="date">Date</option>
                    </select>
                </div>
            </div>
            
        <div class="d-flex justify-content-around row p-0">
            
            <div v-for="sheet of sheetsFilter" :key="sheet" class="card col-2 p-0 m-4">
                <img :src="sheet.img" class="card-img-top img_card" style="object-fit: cover; height:20em; object-position: 0 0;" alt="sheet">
                <div class="card-body bg-dark">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">{{ sheet.title }}</h5>
                        <span>{{ sheet.views }}<i class="fa-solid fa-eye"></i></span>
                        <span>{{ sheet.rating.score }}<i class="fa fa-arrow-up"></i></span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="card-text">{{ sheet.author }}</p>
                        <a class="btn btn-primary" @click="play(sheet.id)">Play it</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getSheetsAll2 } from "@/services"
export default {
    async mounted(){
        this.sheets = await getSheetsAll2() || [];
        this.sheetsFilter = this.sheets;
        this.sortBy();
        console.log(this.sheets);
    },
    data(){
        return{
            sheets:[],
            sheetsFilter:[],
            sort:"views"
        }
    },
    
    methods:{
        async filteredList() {
            let arrayOfObj = Object.entries(this.sheets).map((e) => ( "e=",e[1]));
            console.log("sheetsALl",this.sheets);
            arrayOfObj = arrayOfObj.filter(sheet => {
                return sheet.title.toLowerCase().includes(this.search)
            })
            console.log(arrayOfObj);
            this.sheetsFilter=arrayOfObj;
        },
        async sortBy(){
            console.log(this.sort);
            let arrayOfObj = Object.entries(this.sheets).map((e) => ( "e=",e[1]));
            arrayOfObj.sort(this.compare)
            this.sheetsFilter=arrayOfObj;
        },

        compare( a, b ) {
            if ( a[this.sort] > b[this.sort] ){
                return -1;
            }
            if ( a[this.sort] < b[this.sort] ){
                return 1;
            }
            return 0;
        },
        play(id){
            console.log("enter play" + id);
            localStorage.setItem('sheet',id);
            localStorage.setItem("view", true);
            this.$router.push({
                name: 'compose',
                // params: {view : true}
            });
        },
    }
}
</script>

<style>

</style>