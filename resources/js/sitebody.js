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
            default_url:"",
            name:"",
            price:0,
            description:""
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
        }
    },

    template:
       `<div v-if="showimpressum">
           <impressum></impressum>
       </div>
       <div v-else>
            <h1>Warenkorb:</h1>
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
                    <td class="align-center"><button @click="removeFromCart(item.id)">-</button></td>
                </tr>
                </tbody>
            </table>


            <h1 class="articles">Artikelübersicht:</h1>
            <h2>Suche:</h2>
            Suchbegriff:
            <input type="text" v-model="searchvalue" @input="loadArticles" class="articles__searchbox articles__searchbox--colorchange">
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
                    <td class="align-center"><button @click="addToCart(item.id)">+</button></td>
                </tr>
                </tbody>
            </table>
            <button @click="prevPage">Vorherige Seite</button>
            {{offset / 5 + 1}}
            <button @click="nextPage">Nächste Seite</button>

            <h1>Artikel hinzufügen</h1>
            <form class="form">
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
