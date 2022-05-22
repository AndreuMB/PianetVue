<template>
<div>
    <h1 class="display-1 contental-center">PIANET</h1>

    <div>
        <div class="p-3">
            <h4 class="display-4 contental-center mb-2">POPULAR SHEETS</h4>
        </div>

        <div class="d-flex justify-content-around row p-0">
            <div v-for="sheet of sheetsPopular" :key="sheet" class="card col-2 p-0 m-4">
                <img :src="sheet.img" class="card-img-top img_card" alt="example-sheet">
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
            <h4 class="display-4 contental-center mb-2">DISCOVER</h4>
        </div>

        <div class="d-flex justify-content-around row p-0">
            <div v-for="sheet of sheetsRandom" :key="sheet" class="card col-2 p-0 m-4">
                <img :src="sheet.img" class="card-img-top img_card" alt="example-sheet">
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
            <h4 class="display-4 contental-center mb-2">LAST SHEETS</h4>
        </div>

        <div class="d-flex justify-content-around row p-0">
            <div v-for="sheet of sheetsLatest" :key="sheet" class="card col-2 p-0 m-4">
                <img :src="sheet.img" class="card-img-top img_card" alt="example-sheet">
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
        this.sheetsPopular = await getHomeSheets("views") || [];
        console.log(this.sheetsPopular);
        this.sheetsLatest = await getHomeSheets("date") || [];
        this.sheetsRandom = await getHomeSheets("random") || []
    },
    data(){
        return{
            sheets:[]
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
    }
}
</script>

<style>

</style>