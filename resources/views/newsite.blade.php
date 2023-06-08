<!DOCTYPE html>
<html lang="de" xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="UTF-8">
    <title>Newsite</title>
    <link rel="stylesheet" href="{{ asset('/css/app.css') }}">
    <script src="https://unpkg.com/vue@next"></script>
    <style>
        img {
            width: 100px;
            height: 50px;
        }
    </style>
</head>

<body>

    <div id="app">
        <site-header :navelements="navElements"></site-header>
        <site-body :showimpressum="showImpressum"></site-body>
        <site-footer @toggle-impressum="toggleImpressum"></site-footer>
    </div>

<script type="module" >
    import SiteHeader from "/js/siteheader.js";
    import SiteBody from "/js/sitebody.js";
    import SiteFooter from "/js/sitefooter.js";

    let vm = Vue.createApp({
        data(){
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
                console.log(this.showImpressum);
            }
        },
    }).mount('#app');

</script>
</body>
</html>

