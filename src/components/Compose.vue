<template>
    <div id="container">
        <h1>{{ title }}</h1>
        <div style="background-color: white;" ref="stave_container"></div>
        <a v-for="note of notes" :key="note" class="btn btn-dark" @click="print_note(note)">{{note}}</a>
        <br>
        <a class="btn btn-dark" @click="setDuration('8')">8</a>
        <a class="btn btn-dark" @click="setDuration('q')">Q</a>
        <a class="btn btn-dark" @click="setDuration('h')">H</a>

        <a v-if="user" class="btn btn-primary" @click="saveSheet()">Save</a>
    </div>
</template>

<script>
import Vex from "vexflow";
import { getSheet, saveSheet } from "@/services"
export default {
    async beforeMount(){
        if (localStorage.getItem('idToken')){
            // console.log("idtoken = " + localStorage.getItem('idToken'));
            this.user = true;
        }
        if (localStorage.getItem('sheet')){
            this.sheet = await getSheet();
            this.title = this.sheet.title;
        }
    },
    async mounted() {
        window.addEventListener('resize', this.resizeSheet);
        if (localStorage.getItem('sheet')){
            this.sheet = await getSheet();
            // this.saveSheet();
        }
        this.getSheet();
    },
    unmounted() {
        window.removeEventListener('resize', this.resizeSheet);
        localStorage.removeItem("sheet");
    },
    data(){
        return{
            title : "",
            notes :'A,B,C,D,E,F,G'.split(','),
            user:false,
            data:{
                notesMeasurex : [],
                notesComplete : [],
                staveMeasurex : {},
                timex : 10,
                yStave : 0,
                group : {},
                div : "",
                timewidth: 300,
                duration:"q",
                timeDuration:0,
                durationValue:1
            },
            sheet : []
        }
    },
    methods:{

        getSheet(){
            this.createSheet();
            if(this.sheet){
                if(this.sheet.sheetNotes){
                    console.log("sheet", this.sheet.sheetNotes);
                    this.data.notesComplete = this.sheet.sheetNotes;
                    this.data.notesComplete.forEach((element) => {
                        console.log(element.keys);
                        this.print_note(element.keys,false);
                    });
                }
            }
        },
        createSheet(){
            this.data.notesMeasurex = [];
            this.data.timex = 10;
            this.data.yStave = 0;
            this.data.div = this.$refs.stave_container;
            // COMPLEX VF
            
            let VF = Vex.Flow;    
            
            let renderer = new VF.Renderer(this.data.div, VF.Renderer.Backends.SVG);
            
            // Size our SVG:
            renderer.resize(this.data.div.offsetWidth, 700); // width and height to print notes
            
            // Get a drawing context:
            this.context = renderer.getContext();
            
            // let stave:any = [];
            // let song:any = []

            // time / set first stave position
            this.data.staveMeasurex = new Vex.Flow.Stave(10,0,this.data.timewidth);

            this.data.staveMeasurex.addClef("treble").addTimeSignature("4/4");
            this.data.staveMeasurex.setContext(this.context).draw(); // print stave/time
            // this.data.notesMeasurex={};
        },

        print_note(id,duration,sw=true){
            // console.log("print_note");
            
            let data = this.data;
            let context = this.context;
            if (data.timeDuration >= 4) {
                data.timeDuration=0;
                data.timex = data.timex + data.timewidth;
                // console.log("timex = " + data.timex + " div = " + data.div.offsetWidth);
                if (this.change_line(data.timex+data.timewidth, data.div.offsetWidth)) {
                    data.timex = 10;
                    data.yStave += 100;
                }
                // new time / x,y,width
                data.staveMeasurex = new Vex.Flow.Stave(data.timex,data.yStave,data.timewidth);
                data.staveMeasurex.setContext(context).draw(); // print stave/time
                data.notesMeasurex = [];
            }

            data.timeDuration=data.timeDuration+data.durationValue;



            // reload time
            // console.log("data.notesMeasurex.length" , data.notesMeasurex.length);
            

            if (data.notesMeasurex.length != 0) {
            // console.log("remove child");
            
            context.svg.removeChild(data.group);
            }
            data.group = context.openGroup();

            // add note
            if (sw) {
                data.notesMeasurex.push(new Vex.Flow.StaveNote({ keys: [id+"/4"], duration: data.duration }));
                data.notesComplete.push({ keys: id+"/4", duration: data.duration });
            }else{
                data.notesMeasurex.push(new Vex.Flow.StaveNote({ keys: [id+"/4"], duration: duration }));

            }

            // console.log('id = ' + id, " context = ", context + " data = " , data);

            // print notes
            Vex.Flow.Formatter.FormatAndDraw(context, data.staveMeasurex, data.notesMeasurex);
            
            context.closeGroup();
            // console.log(data.notesMeasurex);
            this.data = data;
            return data;
        },

        resizeSheet(){
            // console.log(this.data.div.offsetWidth + "%" + this.data.timewidth + "=" +this.data.div.offsetWidth%this.data.timewidth);
            // if (this.data.div.offsetWidth%this.data.timewidth < 50) {
                // console.log("enter resize if");
                this.data.div.innerHTML="";
                this.createSheet();
                // console.log("resize ", this.data.notesComplete);
                this.data.notesComplete.forEach((element) => {
                    // console.log(element.keys);
                    this.print_note(element.keys,element.duration,false);
                });
            // }
        },

        change_line(width_stave, width_div){
            if (width_stave>width_div) {
            return true;
            }
            return false;
        },

        async saveSheet(){
            let title = "";
            if (!localStorage.getItem('sheet')) {
                title=prompt("Title:")
            }
            console.log("save sheet " + title);
            let svg = document.querySelector("svg");
            // console.log("svg " , svg);
            
            var xml = new XMLSerializer().serializeToString(svg);
        
            // make it base64
            var svg64 = btoa(xml);
            var b64Start = 'data:image/svg+xml;base64,';
        
            // prepend a "header"
            let image64 = b64Start + svg64;


            // console.log("image ", image64);
            

            console.log(this.data.notesComplete);
            
            let response = await saveSheet(this.data.notesComplete,image64,title);
            console.log("response save sheet", response);
        },

        setDuration(duration){
            console.log("duration"+ duration);
            this.data.duration=duration;
            switch (duration) {
                case "8":
                    this.data.durationValue=0.5;
                    break;
                case "q":
                    this.data.durationValue=1;
                    break;
                
                case "h":
                    this.data.durationValue=2;
                    break;
            
                default:
                    break;
            }
        }
    }
}
</script>

<style>

</style>