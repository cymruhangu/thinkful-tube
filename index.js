const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(searchTerm, callback) {
  const settings = {
    type: 'GET',
    url: YOUTUBE_SEARCH_URL,
    dataType: 'json',
    data: {
      maxResults: '25',
      part: 'snippet',
      q: `${searchTerm}`,
      key: 'AIzaSyCqJXBeMiVGZJzIUVoZYxYcMbyfOEc19AY'
    },
    success: callback
  };
  $.ajax(settings);
}

//     .done(function(data){
//     console.log(`data.kind - ${data.kind}`);
//     console.log(`data.items[0].snippet.thumbnails.high.url - ${data.items[0].snippet.thumbnails.medium.url}`);
//     console.log(`data.items[0].title - ${data.items[0].snippet.title}`);
//     console.log(`data.items[0].description - ${data.items[0].snippet.description}`);
//     console.log(data);


//   }).fail(function(){
//       console.log("FAILED TO GET JSON!!");
//   });
// }


function renderResult(thumb_url, real_url) {
  console.log(`renderResult ran and was passed ${thumb_url}`);
  return `
    <div class="thumbnail">
      <a target="_blank" data-src="${thumb_url}"  class="thumbnail" href="https://www.youtube.com/watch?v=${real_url}"><img src="${thumb_url}" alt="An"/></a>
    </div>
  `;
}

function displayYouTubeSearchData(data) {
  console.log(data);
  

  const results = data.items.map((item, index) => renderResult(item.snippet.thumbnails.medium.url, item.id.videoId));
  console.log(`results are: ${results}`);
  $('.gallery').html(results);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayYouTubeSearchData);
  });
}

$(watchSubmit);
