export default {
    data() {
        return {
            shoppingcart:[],

        }
    },
    mounted() {
        this.refreshShoppingCart();
        this.emitInterface();
    },
    methods: {
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
        emitInterface() {
            this.$emit("interface", {
                addToCart: (id) => this.addToCart(id),
            });
        }
    },
    template: `
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
    `
}
