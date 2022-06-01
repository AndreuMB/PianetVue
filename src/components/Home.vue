<template>
<div>
    <h1 class="display-1 contental-center">PIANET</h1>

    <div>
        <div class="p-3">
            <h4 class="display-4 contental-center mb-2">POPULAR SHEETS</h4>
        </div>

        <div class="d-flex justify-content-around row p-0">
            <div v-for="sheet of sheetsPopular" :key="sheet" class="card col-2 p-0 m-4">
                <img :src="sheet.img" class="card-img-top img_card" style="object-fit: cover; height:20em; object-position: 0 0;" alt="sheet">
                <div class="card-body bg-dark">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">{{ sheet.title }}</h5>
                        <span>{{ sheet.views }}<i class="fa-solid fa-eye"></i></span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="card-text">{{ sheet.author }}</p>
                        <a class="btn btn-primary" @click="play(sheet.id)">Play it</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div>
        <div class="p-3">
            <h4 class="display-4 contental-center mb-2">SCORE</h4>
        </div>

        <div class="d-flex justify-content-around row p-0">
            <div v-for="sheet of sheetsScore" :key="sheet" class="card col-2 p-0 m-4">
                <img :src="sheet.img" class="card-img-top img_card" style="object-fit: cover; height:20em; object-position: 0 0;" alt="sheet">
                <div class="card-body bg-dark">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">{{ sheet.title }}</h5>
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

    <div>
        <div class="p-3">
            <h4 class="display-4 contental-center mb-2">LAST SHEETS</h4>
        </div>

        <div class="d-flex justify-content-around row p-0">
            <div v-for="sheet of sheetsLatest" :key="sheet" class="card col-2 p-0 m-4">
                <img :src="sheet.img" class="card-img-top img_card" style="object-fit: cover; height:20em; object-position: 0 0;" alt="sheet">
                <div class="card-body bg-dark">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">{{ sheet.title }}</h5>
                        <span>{{ sheet.views }}<i class="fa-solid fa-eye"></i></span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="card-text">{{ sheet.author }}</p>
                        <a class="btn btn-primary" @click="play(sheet.id)">Play it</a>
                    </div>
                </div>
            </div>
        </div>
    </div>


</div>

</template>

<script>
import { getHomeSheets } from "@/services"

export default {
    async mounted(){
        let sheetsPopular = await getHomeSheets("views") || [];
        this.sheetsPopular = this.sortBy(sheetsPopular,"views");
        let sheetsLatest = await getHomeSheets("date") || [];
        this.sheetsLatest = this.sortBy(sheetsLatest,"date");
        let sheetsScore = await getHomeSheets("score") || [];
        this.sheetsScore = this.sortBy(sheetsScore,"rating.score");

    },
    data(){
        return{
            sheetsPopular:[],
            sheetsLatest:[],
            sheetsScore:[],
            sort:"",
            sort2:"",
        }
    },
    methods:{
        play(id){
            console.log("enter play" + id);
            localStorage.setItem('sheet',id);
            this.$router.push({
                name: 'compose',
                params: {view : true}
            });
        },
        sortBy(object,orderby){
            this.sort=orderby;
            if (this.sort.indexOf(".")!=-1) {
                this.sort1 = this.sort.split('.')[0];
                this.sort2 = this.sort.split('.')[1];
            }else{
                this.sort2="";
            }
            let arrayOfObj = Object.entries(object).map((e) => ( "e=",e[1]));
            arrayOfObj.sort(this.sortNumber)
            arrayOfObj = arrayOfObj.slice(0,4);
            console.log(arrayOfObj);
            return arrayOfObj;
        },

        sortNumber(a,b){
            if (this.sort2!="") {
                return b.rating.score - a.rating.score;
            }else{
                return b[this.sort] - a[this.sort];
            }
        },
    }
}
</script>

<style>

</style>