<template>
    <div id="container">
        <div style="background-color: white;" ref="stave_container"></div>
        <a v-for="note of notes" :key="note" class="btn btn-dark" @click="print_note(note)">{{note}}</a>
        <a v-if="user" class="btn btn-primary" @click="saveSheet()">Save</a>
    </div>
</template>

<script>
import Vex from "vexflow";

export default {
    beforeMount(){
        if (localStorage.getItem('idToken')){
            console.log("idtoken = " + localStorage.getItem('idToken'));
            this.user = true;
        }
    },
    mounted() {
        window.addEventListener('resize', this.resizeSheet);
        this.createSheet();
    },
    unmounted() {
        window.removeEventListener('resize', this.resizeSheet);
    },
    data(){
        return{
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
            }
        }
    },
    methods:{
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
            this.data.staveMeasurex = new Vex.Flow.Stave(10,0,300);

            this.data.staveMeasurex.addClef("treble").addTimeSignature("4/4");
            this.data.staveMeasurex.setContext(this.context).draw(); // print stave/time
            // this.data.notesMeasurex={};
        },

        print_note(id,sw=true){
            // console.log("print_note");
            
            let data = this.data;
            let context = this.context;
            
            if (data.notesMeasurex.length == 4) {
            data.timex = data.timex + 300;
            console.log("timex = " + data.timex + " div = " + data.div.offsetWidth);
            if (this.change_line(data.timex+300, data.div.offsetWidth)) {
                data.timex = 10;
                data.yStave += 100;
            }
            // new time / x,y,width
            data.staveMeasurex = new Vex.Flow.Stave(data.timex,data.yStave,300);
            data.staveMeasurex.setContext(context).draw(); // print stave/time
            data.notesMeasurex = [];
            }


            // reload time
            console.log("data.notesMeasurex.length" , data.notesMeasurex.length);
            
            if (data.notesMeasurex.length != 0) {
            console.log("remove child");
            
            context.svg.removeChild(data.group);
            }
            data.group = context.openGroup();

            // add note
            data.notesMeasurex.push(new Vex.Flow.StaveNote({ keys: [id+"/4"], duration: "q" }));
            if (sw) {
            data.notesComplete.push({ keys: id+"/4", duration: "q" });
            }

            // console.log('id = ' + id, " context = ", context + " data = " , data);

            // print notes
            Vex.Flow.Formatter.FormatAndDraw(context, data.staveMeasurex, data.notesMeasurex);
            
            context.closeGroup();
            console.log(data.notesMeasurex);
            this.data = data;
            return data;
        },

        resizeSheet(){
            console.log("test = " + this.data.div.offsetWidth);
        },

        change_line(width_stave, width_div){
            if (width_stave>width_div) {
            return true;
            }
            return false;
        }
    }
}
</script>

<style>

</style>