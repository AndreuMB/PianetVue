<template>
    <div id="container">
        <h1>{{ title }}</h1>
        <div style="background-color: white;" ref="stave_container"></div>
        <div v-if="view_sw">
        <a v-for="note of notes" :key="note" class="btn btn-dark" @click="print_note(note)">{{note}}</a>
        <br>
        
        <a class="btn btn-dark bg-white" @click="setDuration('8')"><img src="src/assets/8.png" alt="8"></a>
        <a class="btn btn-dark bg-white" @click="setDuration('q')"><img src="src/assets/1.png" alt="Q"></a>
        <a class="btn btn-dark bg-white" @click="setDuration('h')"><img src="src/assets/2.png" alt="H"></a>
        
        <a v-if="user" class="btn btn-primary" @click="saveSheet()">Save</a>
        <div v-if="user" class="btn btn-primary" @click="downloadSheet()">Download</div>
        </div>
    </div>
</template>

<script>
import Vex from "vexflow";
import { getSheet, saveSheet, createSheet } from "@/services"
export default {
    async beforeMount(){
        console.log('Params: ', this.$route.params.view);
        
        if (localStorage.getItem('idToken')){
            this.user = true;
        }
    },
    async mounted() {
        window.addEventListener('resize', this.resizeSheet);
        if (localStorage.getItem('sheet')){
            this.sheet = await getSheet();
            this.title = this.sheet.title;
        }
        this.data.div = this.$refs.stave_container;
        this.getSheet();

        if (localStorage.getItem('idToken') && localStorage.getItem('sheet')){
            this.saveSheet();      
        }

        if (this.$route.params.view=="true") {
            this.view_sw=false;
        }
    },
    unmounted() {
        window.removeEventListener('resize', this.resizeSheet);
        // localStorage.removeItem("sheet");
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
            heightSvg:700,
            renderer:"",
            sheet : [],
            view_sw : true,
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
                        // console.log(element.keys);
                        this.print_note(element.keys,element.duration,false);
                    });
                }
            }
        },
        createSheet(){
            this.data.notesMeasurex = [];
            this.data.timex = 10;
            this.data.yStave = 0;
            this.data.timeDuration = 0;
            this.heightSvg=700;

            

            this.data.div.innerHTML="";
            
            // COMPLEX VF
            
            let VF = Vex.Flow;    
            
            this.renderer = new VF.Renderer(this.data.div, VF.Renderer.Backends.SVG);
            
            // Size our SVG:
            this.renderer.resize(this.data.div.offsetWidth, this.heightSvg); // width and height of svg where notes are printed
            
            // Get a drawing context:
            this.context = this.renderer.getContext();
            
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
                    if (data.yStave>=this.heightSvg) {
                        console.log("enter heightSvg");
                        this.heightSvg+=100;
                        this.renderer.resize(this.data.div.offsetWidth, this.heightSvg);
                    }
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
            this.createSheet();
            this.data.notesComplete.forEach((element) => {
                console.log(element.keys);
                this.print_note(element.keys,element.duration,false);
            });
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
                title=prompt("Title:");
                if (title != null) {
                    let response = await createSheet({ title:title });
                    localStorage.setItem("sheet", response);
                }else{
                    return
                }
            }
            
            let div2 = document.createElement("div");
            div2.style="background-color:white; width:650px; height:900px;";
            let container = document.querySelector("#container");
            container.append(div2);
            this.data.div = div2;
            this.resizeSheet();
            let svg = document.querySelectorAll("svg")[1];
            // let svg = document.querySelector("svg");
            // console.log("svg " , svg);
            
            var xml = new XMLSerializer().serializeToString(svg);

            div2.remove();

            // make it base64
            var svg64 = btoa(xml);
            var b64Start = 'data:image/svg+xml;base64,';
        
            // prepend a "header"
            let image64 = b64Start + svg64;
            
            let response = await saveSheet(this.data.notesComplete,image64,title);
            console.log("response save sheet", response);
            this.data.div=this.$refs.stave_container;
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
        },
        
        downloadSheet(){
            // console.log("download");
            // // let doc = new pdfkit();
            // const PDFDocument = require('pdfkit');
            // const doc = new PDFDocument;
        },
    }
}
</script>

<style>

</style>