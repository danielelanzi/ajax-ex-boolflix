//api_key
// b9cd166635b627d3a7e76d98d93af973

// Ricerca e refresh ad ogni tasto della tastiera
$(document).ready(function () {
  $("#query").keyup(function () {
    search();
  })
  // Effetto comparsa/scomparsa barra ricerca
  $(document).on('click', '.search-bar', function(){
    $('#query').toggleClass('active');
    $('.search-bar').toggleClass('active');
    $('#query').focus();
  });

  // effetto slide
  var mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'vertical',
    loop: true
  })
});

function search() {
  var query = $('#query').val();
  resetSearch();

  var api_key = 'b9cd166635b627d3a7e76d98d93af973';

  var urlMovie = 'https://api.themoviedb.org/3/search/movie';
  var urlTv = 'https://api.themoviedb.org/3/search/tv';

  var typeMovie = 'film';
  var typeTv = 'tv';

  getData(query, api_key, urlMovie, typeMovie, '.films');
  getData(query, api_key, urlTv, typeTv, '.tvs');
}


function resetSearch() {
  $('.films').html('');
  $('.tvs').html('');
}

function getData(string, api_key, url, type, container) {
  $.ajax({
    url: url,
    method: 'GET',
    data: {
      api_key: api_key,
      query: string,
      language: 'it-IT'
    },
    success: function(data) {
      var film = $('.films').html();
      var tv = $('.tvs').val();
      //controllo che ci siano risultati
      if(data.total_results > 0) {
        var results = data.results;
        printResult(type, results);
      } else if ((film == 0)) {
        Toastify({
          text: "Nessun film trovato",
          duration: 1500,
          gravity: "bottom",
          position: 'right',
          backgroundColor: "linear-gradient(147deg, #FF0000 10%, #FF2525 60%)",
        }).showToast();
      } else if (tv == 0) {
        Toastify({
          text: "Nessuna serie tv trovata",
          duration: 1500,
          gravity: "bottom",
          position: 'right',
          backgroundColor: "linear-gradient(147deg, #FF0000 10%, #FF2525 60%)",
        }).showToast();
      }
        // Attivare questo se si vuole stampare i dati non disponibili con Handlebars
      // else {
      //   printNoResult($(container));
      // }
    },
    error: function (request, state, errors) {
      console.log(errors);
    }
  });
}

// Stampa delle stelle di valutazione
function printStars (num) {
  num = Math.ceil(num / 2);
  var string = '';
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      string += '<i class="fas fa-star"></i>';
    } else {
      string += '<i class="far fa-star"></i>';
    }
  }
  return string
}

// Stampa la lingua del titolo con la bandiera
function printLanguage (string) {
  var availableLangs = [
    'en',
    'it',
    'es',
    'fr',
    'de',
    'ru',
  ];
  if (availableLangs.includes(string)) {
    string = '<img class="lang" src="img/flag/' + string + '.svg" alt="'+ string + '">';
  }
  return string;
}

// Stampare Risultati film e serie tv con Handlebars
function printResult(type, results){
  var source = $('#film-template').html();
  var template = Handlebars.compile(source);
  var title;
  var originalTitle;
  for (var i = 0; i < results.length; i++) {
    var thisResult = results[i];
    if (type == 'film') {
      originalTitle = thisResult.original_title;
      title = thisResult.title;
      var container = $('.films');
    } else if (type == 'tv') {
      originalTitle = thisResult.original_name;
      title = thisResult.name;
      var container = $('.tvs');
    }
    var posterImage;
    var urlBaseImage = 'https://image.tmdb.org/t/p/w342';

    if(thisResult.poster_path == null) {
      posterImage = 'img/nessunacopertina.jpg'
    } else {
        posterImage =  urlBaseImage + thisResult.poster_path
    }

    var context = {
      type: type,
      title: title,
      original_title: originalTitle,
      original_language: printLanguage(thisResult.original_language),
      vote_average: printStars(thisResult.vote_average),
      poster: posterImage,
    };
    var html = template(context);
    container.append(html);
  }
}

// Funzione per stampare i dati non disponibili con Handlebars
function printNoResult (container) {
  var source = $('#noresult-template').html();
  var template = Handlebars.compile(source);
  var html = template();
  container.append(html);
}