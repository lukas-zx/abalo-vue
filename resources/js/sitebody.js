import Impressum from './impressum';
import Textarea from "primevue/textarea";
let articles = [];

export default {
    components: {
        Impressum,
        Textarea,
    },
    props:{
        showimpressum:Boolean,
    },
    data() {
        return {
            searchvalue:"",
            search:"",
            limit:5,
            offset:0,
            pagesize:5,
            articleCount:0,
            items:[],
            shoppingcart:[],
            default_url:"",
            name:"",
            price:"",
            description:"",
            userid: 0
        }
    },
    mounted() {
        this.setUserId();
        this.updateURL();
        this.loadArticles();
        this.refreshShoppingCart();
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

                    if(json.length === 0) this.search = "Keine Suchergebnisse";
                    else this.search = "Ergebnisse:"

                    this.items = json.articles;
                })
                .catch(error => {
                    console.log('error loading articles: ' + error);
                })
        },
        addToCart(id) {
            axios.post('/api/shoppingcart', {
                id: id
            })
                .catch(error => {
                    console.error('error adding to shoppingcart: ' + error);
                })

            this.refreshShoppingCart();
        },
        removeFromCart(id) {
            let url = '/api/shoppingcart/1/articles/' + id;

            axios.delete(url).catch(error => {
                console.error('error removing from shoppingcart: ' + error);
            })

            this.refreshShoppingCart();
        },
        refreshShoppingCart() {
            axios.get('/api/shoppingcart')
                .then(response => {
                    this.shoppingcart = response.data;
                })
                .catch(error => {
                    console.error('error refreshing shoppingcart: ' + error);
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
        submit() {
            if (this.price <= 0) alert('Preis muss > 0 sein');
            else {
                let url = '/api/article?name=' + this.name + '&price=' + this.price + '&description=' + this.description;
                axios.post(url)
                    .then(response => {
                        alert('Erfolgreich');
                        this.loadArticles();
                    })
                    .catch(error => {
                        alert('Fehler: ' + error);
                    })

            }
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
        }
    },

    template:
       `<div v-if="showimpressum">
           <impressum></impressum>
       </div>
       <div v-else>
            <h1>Warenkorb:</h1>
            <table v-if="this.shoppingcart.length > 0" class="articlelist">
                <thead>
                  <tr class="articlelist__header">
                      <td>Name</td>
                      <td>Preis</td>
                      <td>Beschreibung</td>
                      <td>Creator ID</td>
                      <td>Create Date</td>
                      <td>Image</td>
                      <td>Warenkorb</td>
                  </tr>
                </thead>
                <tbody>
                <tr v-for="item in shoppingcart" :key="item.id" class="articlelist__item articlelist__item--rotate">
                    <td>{{item.ab_name}}</td>
                    <td class="align-center">{{item.ab_price}}</td>
                    <td>{{item.ab_description}}</td>
                    <td class="align-center">{{item.ab_creator_id }}</td>
                    <td>{{item.ab_createdate}}</td>
                    <td>
                        <img :src="item.ab_image" :alt="item.ab_image">
                    </td>
                    <td class="align-center">
                        <button @click="removeFromCart(item.id)">🙅</button>
                    </td>
                </tr>
                </tbody>
            </table>

            <h1 class="articles">Artikelübersicht:</h1>
            <span class="p-input-icon-right">
                <i class="pi pi-search" />
                <InputText class="p-inputtext-lg" type="text" v-model="searchvalue"
                           @input="loadArticles" placeholder="Suchbegriff" tab/>
            </span>
            <h3>{{ search }}</h3>
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

            <h1>Artikel hinzufügen</h1>
            <form class="form" id="newarticle_form">
                <span class="p-float-label">
                    <InputText class="form__input" id="name" type="text" maxlength="80" v-model="name" tab required />
                    <label for="name">Artikelname</label>
                </span>
                <span class="p-float-label form__input">
                    <InputText class="form__input" id="price" type="text" v-model="price" tab required/>
                    <label for="price">Preis</label>
                </span>
                <span class="p-float-label">
                    <Textarea class="form__textarea" id="description" cols="30" rows="10"
                              maxlength="1000" v-model="description" tab required auto-resize/>
                    <label for="description">Artikelbeschreibung</label>
                </span>
                <button @click="submit" class="form__submitbutton form__submitbutton--hover">Speichern</button>
                <Button label="Hinzufügen"/>
            </form>
       </div>`,
}
