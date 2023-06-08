
export default{
    methods:{
        toggleImpressum(){
           this.$emit('toggle-impressum');
        }
    },
    template:
        `<footer class="footer">
      <p class="footer__paragraph">Das ist unser Footer.</p>
      <a @click="toggleImpressum" href="#" class="footer__link footer__link--hover">Impressum </a><br>
      </footer>`
    ,

}

