
export default {

    props:['navelements'],
    mounted(){
        this.createMenu();
    },
    methods:{
        createMenu(){
            function Navigation(navelements) {
                this.navelements = navelements;

                // print the navigation as an html unordered list
                this.printNav = function(){
                    let nav = document.createElement('ul');
                    this.navelements.forEach(function(value, key) {
                        let element = document.createElement('li');
                        element.innerText = value[0];
                        nav.appendChild(element);

                        if (value[1] !== null) {
                            let parent = element;
                            let innerNav = document.createElement('ul');
                            value[1].forEach(function(value, key) {
                                let element = document.createElement('li');
                                element.innerText = value;
                                innerNav.appendChild(element);
                            })
                            parent.appendChild(innerNav);
                        }
                    });
                    document.getElementById('nav').appendChild(nav);
                };

                // add an element to the end of the navigation
                this.append = function(name) {
                    let item = [name, null];
                    this.navelements.push(item);
                }

                // add an element to the navigation at the given postion (starts with 1)
                this.add = function(position, name) {
                    let item = [name, null];
                    this.navelements.splice(position - 1, 0, item);
                }

                // remove an element from the navigation
                this.remove = function(element) {
                    let index = -1;
                    this.navelements.forEach(function(value, key) {
                        if (value[0] === element) navelements.splice(navelements.indexOf(value), 1);
                    })
                }

                // add a child to an element in the nav
                this.addChild = function(parent, child) {
                    this.navelements.forEach(function(value, key) {
                        if (value[0] === parent) {
                            if (value[1] === null) value[1] = [child];
                            else value[1].append(child);
                        }
                    })
                }

                // remove a child from an element in the nav
                this.removeChild = function(parent, child) {
                    this.navelements.forEach(function(value, key) {
                        if (value[0] === parent) value[1].splice(value[1].indexOf(child), 1);
                    })
                }
            }

           let nav = new Navigation(this.navelements);
            nav.printNav();

        }
    },
        template:`<div id="nav"></div>`,




}
