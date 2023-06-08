import Impressum from './impressum'
export default{
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
            items:[],
            shoppingcart:[],
            default_url:""
        }
    },
    mounted() {
        this.updateURL();
        this.loadArticles();
        this.refreshShoppingCart();
    },
    methods: {
        updateURL() {
            this.default_url = '/api/article' + '?limit=' + this.limit + '&offset=' + this.offset + '&search=' + this.searchvalue;
        },
        loadArticles() {
            console.log(this.searchvalue);
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
                        if (json.length === 0) {
                            this.search = "Keine Suchergebnisse";
                        } else {
                            this.search = "Ergebnisse: "
                        }
                        this.items = json;
                        console.log(json);
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
                        console.error(xhr.statusText);
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
                        console.error(xhr.statusText);
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
                        let json = JSON.parse(xhr.responseText);
                        this.shoppingcart = json;
                        console.log(this.shoppingcart);
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
    },

    template:
       `<div v-if="showimpressum">
           <impressum></impressum>
       </div>
       <div v-else>
            <h1>Warenkorb:</h1>
            <table>
                <thead>
                  <tr>
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
                <tr v-for="item in shoppingcart" :key="item.id">
                    <td>{{item.ab_name}}</td>
                    <td>{{item.ab_price}}</td>
                    <td>{{item.ab_description}}</td>
                    <td>{{item.ab_creator_id }}</td>
                    <td>{{item.ab_createdate}}</td>
                    <td>
                        <img :src="item.ab_image" :alt="item.ab_image">
                    </td>
                    <td><button @click="removeFromCart(item.id)">-</button></td>
                </tr>
                </tbody>
            </table>


            <h1>Artikelübersicht:</h1>

            <h2>Suche:</h2>
            Suchbegriff:
            <input type="text" v-model="searchvalue" @input="loadArticles">
            <h3>{{ search }}</h3>
            <table>
                <thead>
                <tr>
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
                <tr v-for="item in items" :key="item.id">
                    <td>{{ item.ab_name }}</td>
                    <td>{{item.ab_price}}</td>
                    <td>{{item.ab_description}}</td>
                    <td>{{item.ab_creator_id }}</td>
                    <td>{{item.ab_createdate}}</td>
                    <td>
                        <img :src="item.ab_image" :alt="item.ab_image">
                    </td>
                    <td><button @click="addToCart(item.id)">+</button></td>
                </tr>
                </tbody>
            </table>
            <button @click="prevPage">Vorherige Seite</button>
            {{offset / 5 + 1}}
            <button @click="nextPage">Nächste Seite</button>
       </div>`,
}
