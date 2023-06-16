import './bootstrap';
import { createApp } from 'vue/dist/vue.esm-browser';
import SiteHeader from './siteheader.js';
import SiteBody from './sitebody.js';
import SiteFooter from './sitefooter.js';

/*
let conn = new WebSocket('ws://localhost:8085/broadcast');
conn.onmessage = function(e) {
    let json = JSON.parse(e.data);
    if (json.type === "sold") {
        axios.get('/isloggedin')
            .then(response => {
                let user = response.data;
                app.setUserId(user['id']);
                if (user['auth']) {
                    if (user['id'] === json.creatorid) alert(json.message);
                }
            })
    } else if (json.type === "promote") {

    } else {
        alert(json.message);
    }
}
*/

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
            ],
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
        },
    },
}).mount('#app');
