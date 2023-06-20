import Impressum from './impressum';
import Shoppingcart from './shoppingcart';
import AddArticle from './addarticle';
let articles = [];

export default {
    components: {
        Impressum,
        Shoppingcart,
        AddArticle,
    },
    props:{
        showimpressum:Boolean,
    },
    data() {
        return {
            searchvalue:"",
            searchresult:"",
            limit:5,
            offset:0,
            pagesize:5,
            articleCount:0,
            items:[],
            shoppingcart:[],
            default_url:"",
            userid: 0
        }
    },
    mounted() {
        this.setUserId();
        this.updateURL();
        this.loadArticles();
        this.initWebSocket();
    },
    beforeUpdate() {
        articles = this.items;
    },
    methods: {
        initWebSocket() {
            let conn = new WebSocket('ws://localhost:8085/broadcast');
            conn.onmessage = function(e) {
                let json = JSON.parse(e.data);
                switch(json.type) {
                    case "sold": // notify creator
                        axios.get('/isloggedin')
                            .then(response => {
                                let user = response.data;
                                if (user['auth']) {
                                    if (user['id'] === json.creatorid) alert(json.message);
                                }
                            })
                        break;
                    case "promote": // notify every user who sees the article
                        articles.forEach(function (item) {
                           if (item.id === json.articleid) alert(json.message);
                        })
                       break;
                    default: // notify every user
                        alert(json.message);
                }
            }
        },
        updateURL() {
            this.default_url = '/api/article' + '?limit=' + this.limit + '&offset=' + this.offset + '&search=' + this.searchvalue;
        },
        loadArticles() {
            if (this.searchvalue.length >= 3) this.offset = 0;

            this.updateURL();
            axios.get(this.default_url)
                .then(response => {
                    let json = response.data;
                    this.articleCount = json.articleCount;

                    if(json.length === 0) this.searchresult = "Keine Suchergebnisse";
                    else this.searchresult = "Ergebnisse:"

                    this.items = json.articles;
                })
                .catch(error => {
                    console.log('error loading articles: ' + error);
                })
        },
        nextPage() {
            this.offset += this.pagesize;
            this.updateURL();
            this.loadArticles();
        },
        prevPage() {
            if (this.offset >= this.pagesize) this.offset -= this.pagesize;
            this.updateURL();
            this.loadArticles();
        },
        setUserId() {
            axios.get('/isloggedin')
                .then(response => {
                    let user = response.data;
                    if(user['auth']) this.userid = user['id'];
                })
        },
        sellItem(id) {
            axios.post('/api/article/' + id + '/sold')
                .catch(reason => {
                    console.error(reason.message);
                });
        },
        promoteItem(id) {
            axios.post('/api/article/' + id + '/promote')
                .catch(reason => {
                    console.error(reason.message);
                })
        },
    },

    template: `
        <template v-if="showimpressum">
           <impressum></impressum>
       </template>
       <template v-else>

            <shoppingcart></shoppingcart>

            <h1 class="articles">Artikelübersicht:</h1>
            <span class="p-input-icon-right">
                <i class="pi pi-search" />
                <InputText class="p-inputtext-lg" type="text" v-model="searchvalue"
                           @input="loadArticles" placeholder="Suchbegriff" tab/>
            </span>
            <h3>{{ searchresult }}</h3>
            <table class="articlelist">
                <thead>
                <tr class="articlelist__header">
                    <td>Name</td>
                    <td>Preis</td>
                    <td>Beschreibung</td>
                    <td>Creator ID</td>
                    <td>Create Date</td>
                    <td>Image</td>
                    <td>Warenkorb</td>
                    <td>Verkaufen</td>
                    <td>Artikel bewerben</td>
                </tr>
                </thead>
                <tbody class="articlelist__item articlelist__item--hover">
                <tr v-for="item in items" :key="item.id">
                    <td>{{item.ab_name}}</td>
                    <td class="align-center">{{item.ab_price}}</td>
                    <td>{{item.ab_description}}</td>
                    <td class="align-center">{{item.ab_creator_id }}</td>
                    <td>{{item.ab_createdate}}</td>
                    <td>
                        <img :src="item.ab_image" :alt="item.ab_image">
                    </td>
                    <td class="align-center">
                        <button @click="addToCart(item.id)">🛒</button>
                    </td>
                    <td class="align-center">
                        <button @click="sellItem(item.id)">💰</button>
                    </td>
                    <td v-if="this.userid === item.ab_creator_id" class="align-center">
                        <button @click="promoteItem(item.id)">📰</button>
                    </td>
                </tr>
                </tbody>
            </table>
            <button @click="prevPage" v-if="this.offset > 0">Zurück</button>
            Seite {{offset / 5 + 1}} von {{ Math.ceil(this.articleCount / this.limit) }}
            <button @click="nextPage" v-if="this.articleCount > this.offset + this.limit">Weiter</button>

           <add-article></add-article>

       </template>
    `,
}
