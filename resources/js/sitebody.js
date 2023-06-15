import Impressum from './impressum';
import axios from 'axios';

let articles = [];

export default {
    components: {
        Impressum
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
            price:0,
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
        console.log(articles);
    },
    methods: {
        initWebSocket() {
            let conn = new WebSocket('ws://localhost:8085/broadcast');
            conn.onmessage = function(e) {
                let json = JSON.parse(e.data);
                if (json.type === "sold") {
                    axios.get('/isloggedin')
                        .then(response => {
                            let user = response.data;
                            if (user['auth']) {
                                if (user['id'] === json.creatorid) alert(json.message);
                            }
                        })
                } else if (json.type === "promote") {
                    articles.forEach(function (item) {
                        if (item.id === json.articleid) alert(json.message);
                    })
                } else if (json.type === "maintenance") {
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

            // Artikel laden
            let xhr = new XMLHttpRequest();
            xhr.open('GET', this.default_url, true);
            xhr.setRequestHeader('Accept', 'application/json');

            xhr.onload = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        let json = JSON.parse(xhr.responseText);
                        this.articleCount = json.articleCount;
                        if (json.length === 0) {
                            this.search = "Keine Suchergebnisse";
                        } else {
                            this.search = "Ergebnisse: "
                        }
                        this.items = json.articles;
                    }
                }
            }
            xhr.send();
        },
        addToCart(id) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST','/api/shoppingcart', true);
            xhr.setRequestHeader('Accept', 'application/json');

            let item = new FormData();
            item.append("id", id);
            xhr.send(item);

            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.statusText);
                    } else {
                        console.error('error in addToCart: ' + xhr.statusText);
                    }
                }
            }
            this.refreshShoppingCart();
        },
        removeFromCart(id) {
            let xhr = new XMLHttpRequest();
            let url = '/api/shoppingcart/1/articles/' + id;

            xhr.open('DELETE', url, true);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.send();

            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.statusText);
                    } else {
                        console.error('error in removeFromCart: ' + xhr.statusText);
                    }
                }
            }
            this.refreshShoppingCart();
        },
        refreshShoppingCart() {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/shoppingcart', true);
            xhr.setRequestHeader('Accept', 'application/json');

            xhr.onload = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        this.shoppingcart = JSON.parse(xhr.responseText);
                    } else {
                        console.error('error in refreshShoppingCart: ' + xhr.statusText);
                    }
                }
            }
            xhr.send();
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
                let xhr = new XMLHttpRequest();
                let url = '/api/article?name=' + this.name + '&price=' + this.price + '&description=' + this.description;
                xhr.open('POST', url, true);
                xhr.send();

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            alert('Erfolgreich');
                            this.loadArticles();
                        } else {
                            alert('Fehler: ' + xhr.status + ' ' + xhr.statusText);
                        }
                    }
                }
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
            <h2>Suche:</h2>
            Suchbegriff:
            <input type="text" v-model="searchvalue" @input="loadArticles"
                   class="articles__searchbox articles__searchbox--colorchange"
                   id="articlesearchbox">
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
                <label for="name" class="form__label">Name:</label>
                <input type="text" id="name" name="name" maxlength="80" required v-model="name" class="form__input">
                <label for="price" class="form__label">Preis:</label>
                <input type="text" id="price" name="price" required v-model="price" class="form__input">
                <label for="description" class="form__label">Beschreibung:</label>
                <textarea name="description" id="description" cols="30" rows="10" maxlength="1000"
                          required v-model="description" class="form__textarea"></textarea>
                <button @click="submit" class="form__submitbutton form__submitbutton--hover">Speichern</button>
            </form>
       </div>`,
}
