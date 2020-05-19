var proxy = "https://cors--any.herokuapp.com/"; // 'https://cors-anywhere.herokuapp.com/';

Vue.component('loading-screen', {
    template: '<div id="loading">Chargement...</div>'
})




var app = new Vue({
    el: '#app',
    data: {
        message: '',
        posts: [],
        seen: false,
        errors: [],
        news: [],
        isLoading: true

    },
    mounted() {
        setTimeout(() => {
            this.isLoading = false,
                this.news.push("Bienvenue dans la meteo OpenSource !")
        }, 2000)
    },
    methods: {
        sub: function() {

            var self = this // create a closure to access component in the callback below
            self.seen = true;
            var $url = proxy + "https://www.metaweather.com/api/location/search/?query=" + this.message;
            $.getJSON($url, function(data) {
                try {
                    console.log(data[0])

                    $.getJSON(proxy + "https://www.metaweather.com/api/location/" + data[0].woeid, function(data) {
                        console.log(data)
                        self.seen = false;
                        self.posts = data;



                    }).error(function() {
                        self.errors.push("Une erreur est survenue..")
                    });

                } catch (error) {
                    self.errors.push("Ville introuvable")
                    self.seen = false;
                }



                //self.posts = data;
            }).error(function() {
                self.errors.push("Une erreur est survenue..")
            });
        }
    }


})



















//auto completion