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
                this.news.push("Bienvenue dans la météo OpenSource Développé en Vuejs!")
        }, 2000)
    },
    methods: {
        sub: function() {

            var self = this // create a closure to access component in the callback below
            self.seen = true;
            var $url = proxy + "https://www.metaweather.com/api/location/search/?query=" + this.message;
            $.getJSON($url, function(data) {
                try {

                    self.message = data[0].title
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
//https://openclassrooms.com/fr/courses/1916641-dynamisez-vos-sites-web-avec-javascript/2725496-tp-un-systeme-dauto-completion ;)
var searchElement = document.getElementById('search'),
    results = document.getElementById('results'),
    selectedResult = -1, // Permet de savoir quel résultat est sélectionné : -1 signifie "aucune sélection"
    previousRequest, // On stocke notre précédente requête dans cette variable
    previousValue = searchElement.value; // On fait de même avec la précédente valeur



function getResults(keywords) { // Effectue une requête et récupère les résultats

    var xhr = new XMLHttpRequest();
    xhr.open('GET', proxy + 'http://learn.sdlm.be/js/part4/chap5/search.php?s=' + encodeURIComponent(keywords));

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {

            displayResults(xhr.responseText);

        }
    };

    xhr.send(null);

    return xhr;

}

function displayResults(response) { // Affiche les résultats d'une requête

    results.style.display = response.length ? 'block' : 'none'; // On cache le conteneur si on n'a pas de résultats

    if (response.length) { // On ne modifie les résultats que si on en a obtenu

        response = response.split('|');
        var responseLen = response.length;

        results.innerHTML = ''; // On vide les résultats

        for (var i = 0, div; i < responseLen; i++) {

            div = results.appendChild(document.createElement('div'));
            div.innerHTML = response[i];

            div.onclick = function() {
                chooseResult(this);
            };

        }

    }

}

function chooseResult(result) { // Choisi un des résultats d'une requête et gère tout ce qui y est attaché

    searchElement.value = previousValue = result.innerHTML; // On change le contenu du champ de recherche et on enregistre en tant que précédente valeur
    app.message = result.innerHTML;
    results.style.display = 'none'; // On cache les résultats
    result.className = ''; // On supprime l'effet de focus
    selectedResult = -1; // On remet la sélection à "zéro"
    searchElement.focus(); // Si le résultat a été choisi par le biais d'un clique alors le focus est perdu, donc on le réattribue

}



searchElement.onkeyup = function(e) {

    e = e || window.event; // On n'oublie pas la compatibilité pour IE

    var divs = results.getElementsByTagName('div');

    if (e.keyCode == 38 && selectedResult > -1) { // Si la touche pressée est la flèche "haut"

        divs[selectedResult--].className = '';

        if (selectedResult > -1) { // Cette condition évite une modification de childNodes[-1], qui n'existe pas, bien entendu
            divs[selectedResult].className = 'result_focus';
        }

    } else if (e.keyCode == 40 && selectedResult < divs.length - 1) { // Si la touche pressée est la flèche "bas"

        results.style.display = 'block'; // On affiche les résultats

        if (selectedResult > -1) { // Cette condition évite une modification de childNodes[-1], qui n'existe pas, bien entendu
            divs[selectedResult].className = '';
        }

        divs[++selectedResult].className = 'result_focus';

    } else if (e.keyCode == 13 && selectedResult > -1) { // Si la touche pressée est "Entrée"

        chooseResult(divs[selectedResult]);

    } else if (searchElement.value != previousValue) { // Si le contenu du champ de recherche a changé

        previousValue = searchElement.value;

        if (previousRequest && previousRequest.readyState < 4) {
            previousRequest.abort(); // Si on a toujours une requête en cours, on l'arrête
        }

        previousRequest = getResults(previousValue); // On stocke la nouvelle requête

        selectedResult = -1; // On remet la sélection à "zéro" à chaque caractère écrit

    }

};