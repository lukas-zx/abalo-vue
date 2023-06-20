import Textarea from "primevue/textarea";
export default {
    components: {
        Textarea
    },
    data() {
        return {
            name:"",
            price:"",
            description:"",
        }
    },
    methods: {
        submit() {
            if (this.price <= 0) alert('Preis muss > 0 sein');
            else {
                let url = '/api/article?name=' + this.name + '&price=' + this.price + '&description=' + this.description;
                axios.post(url)
                    .then(response => {
                        alert('Erfolgreich');
                    })
                    .catch(error => {
                        alert('Fehler: ' + error);
                    })
            }
        },
    },
    template: `
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
            </form>
    `
}
