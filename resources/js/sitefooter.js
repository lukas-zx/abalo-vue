
export default{
    methods:{
        toggleImpressum(){
           this.$emit('toggle-impressum');
        }
    },
    template:
        `<footer>
      <p>Das ist unser Footer.</p>
      <a @click="toggleImpressum" href="#">Impressum </a><br>
      </footer>`
    ,

}

