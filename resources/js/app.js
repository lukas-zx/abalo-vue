import './bootstrap';
import { createApp } from 'vue/dist/vue.esm-browser';
import SiteHeader from './siteheader.js';
import SiteBody from './sitebody.js';
import SiteFooter from './sitefooter.js';

let conn = new WebSocket('ws://localhost:8085/broadcast');
conn.onmessage = function(e) {
    alert(e.data);
}

const app = createApp({
    data() {
        return {
            items : "",
            search: "",
            showImpressum:false,
            navElements: [
                ['Home', null],
                ['Kategorien', null],
                ['Verkaufen', null],
                ['Unternehmen', ['Philosophie', 'Karriere']]
            ]
        }
    },
    components: {
        SiteHeader,
        SiteBody,
        SiteFooter,
    },
    methods:{
        toggleImpressum(){
            this.showImpressum = !this.showImpressum;
        }
    },
});
app.component('SiteHeader', SiteHeader);
app.component('SiteBody', SiteBody);
const mountedApp = app.mount('#app');
