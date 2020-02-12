//api_key
// b9cd166635b627d3a7e76d98d93af973


$(document).ready(function () {
  $('#query-button').click(function() {
    var query = $('#query').val();
    search();
  });
  $('#query').keypress(function (event) {
    if(event.which == 13) {
      search();
      var num = keyBoard();
    }
  })
});

function keyBoard () {
  arrayKey = [];
  for (var i = 0; i < 100; i++) {
    console.log(arrayKey);
  }
}

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
  $('#query').val('');
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
      //controllo che ci siano risultati
      if(data.total_results > 0) {
        var results = data.results;
        printResult(type, results);
      } else {
        printNoResult($(container));
      }
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
    string = '<img class="lang" src="img/flag/' + string + '.svg" alt="en">';
  }
  return string;
}

// Stampare Risultati film e serie tv
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
    var urlBaseImage = 'https://image.tmdb.org/t/p/w185';

    if(thisResult.poster_path == null) {
      posterImage = '<img src="img/default-poster.png" alt="'+ title +'">'
    } else {
        posterImage = '<img src="' + urlBaseImage + thisResult.poster_path + '" alt="'+ title +'">'
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

function printNoResult (container) {
  var source = $('#noresult-template').html();
  var template = Handlebars.compile(source);
  var html = template();
  container.append(html);
}
