// Vue
import './bootstrap';
import { createApp } from 'vue/dist/vue.esm-browser';

// Abalo
import SiteHeader from './siteheader.js';
import SiteBody from './sitebody.js';
import SiteFooter from './sitefooter.js';

// PrimeVue
import PrimeVue from 'primevue/config';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import InputText from "primevue/inputtext";

// test

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
});
app.use(PrimeVue);
app.component("InputText", InputText);
app.mount('#app');
