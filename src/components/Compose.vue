<template>
    <div id="container">
        <h1>{{ title }}</h1>
        <div ref="stave_container" class="stave"></div>
        <div v-if="view_sw" class="user-btns">
            <a v-for="note of notes" :key="note" class="btn btn-dark" @click="print_note(note)">{{note}}</a>

            <div class="btn_time">
                <button v-for=" time in notesDuration" :key="time" :ref="'btn_'+time.name" 
                class="btn btn-dark bg-white" @click="setDuration(time.name)">
                    <img class="size_img" :src="'src/assets/'+time.name+'.png'" :alt="time.name">
                </button>
            </div>

            <div>
                <a v-if="user" class="btn btn-primary m-3" @click="saveSheet()">Save</a>
                <div v-if="user" class="btn btn-primary m-3" @click="downloadSheet()">Download</div>
            </div>
            
        </div>
    </div>
</template>

<script>
import Vex from "vexflow";
import { getSheet, saveSheet, createSheet } from "@/services"
import { Canvg } from 'canvg';
import { jsPDF } from "jspdf";
export default {
    async mounted() {
        window.addEventListener('resize', this.resizeSheet);
        if (localStorage.getItem('idToken')){
            this.user = true;
        }
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
            notesDuration:[
                {
                    name:"8",
                    duration:0.5
                },
                {
                    name:"q",
                    duration:1
                },
                {
                    name:"h",
                    duration:2
                }
            ],
            heightSvg:700,
            renderer:"",
            sheet : [],
            view_sw : true,
            image:""
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
                        console.log(element.duration);
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
            let data = this.data;
            let context = this.context;
            if (!sw) {
                this.setDuration(duration);
            }
            if (data.timeDuration >= 4) {
                // this.notesDuration.forEach(element => {
                //     this.$refs["btn_"+element.name][0].disabled = false;
                // });
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
            if (data.timeDuration+data.durationValue<=4) {
                data.timeDuration=data.timeDuration+data.durationValue;
                this.notesDuration.forEach(element => {
                    console.log(data.timeDuration != 4);
                    if (element.duration+data.timeDuration>4 && data.timeDuration != 4) {
                        this.$refs["btn_"+element.name][0].disabled = true;
                    }else{
                        this.$refs["btn_"+element.name][0].disabled = false;
                    }
                });


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
                // const beams = [new Vex.Flow.Beam(notes1), new Vex.Flow.Beam(notes2), new Vex.Flow.Beam(notes3)];
                // print notes
                Vex.Flow.Formatter.FormatAndDraw(context, data.staveMeasurex, data.notesMeasurex);
                // beams.forEach((b) => {
                //     b.setContext(context).draw();
                // });
                
                context.closeGroup();
                // console.log(data.notesMeasurex);
                this.data = data;
                return data;
            }

            
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
                    this.title=title;
                    localStorage.setItem("sheet", response);
                }else{
                    return
                }
            }
            

            let div = this.setTemplateSVG(650);
            let svg = div.querySelectorAll("svg")[0];
            
            var xml = new XMLSerializer().serializeToString(svg);

            // make it base64
            var svg64 = btoa(xml);
            var b64Start = 'data:image/svg+xml;base64,';
        
            // prepend a "header"
            let image64 = b64Start + svg64;


            div.remove();


            // save in db
            
            let response = await saveSheet(this.data.notesComplete,image64,title);
            console.log("response save sheet", response);
        },

        setTemplateSVG(width){
            let div2 = document.createElement("div");
            div2.style=`background-color:white; width:${width}px`;
            let container = document.querySelector("#container");
            container.append(div2);
            console.log(div2);

            this.data.div = div2;
            this.resizeSheet();
            this.data.div=this.$refs.stave_container;
            this.resizeSheet();
            
            return div2;
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
        
        async downloadSheet(){

            // PDF FILE

            const canvas = document.createElement('CANVAS');
            const ctx = canvas.getContext('2d');
            let div = this.setTemplateSVG(1000);
            let svg = div.querySelectorAll("svg")[0].outerHTML;
            console.log(svg);
            const v = await Canvg.from(ctx, svg)
            v.render()
            var imgData = canvas.toDataURL('image/png');
            // // Generate PDF
            var doc = new jsPDF('p', 'pt', 'a4');
            doc.addImage(imgData, 'PNG', 50, 50, 550, 0);
            doc.save(this.title+'.pdf');

            div.remove();
        },
    }
}
</script>

<style>
.size_img{
    image-rendering: -webkit-optimize-contrast;
    width: 30px;
    height: 60px;
}
.user-btns{
    position: fixed;
    bottom: 0px;
    background: grey;
    border: black solid 3px;
    border-radius: 12px;
    height:175px;
}
.stave{
    overflow-y: scroll;
    background-color: white;
    height: 700px;
    overflow-x: hidden;
}
</style>