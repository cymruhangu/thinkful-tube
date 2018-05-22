const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(searchTerm, callback) {
  const settings = {
    type: 'GET',
    url: YOUTUBE_SEARCH_URL,
    dataType: 'json',
    data: {
      maxResults: '28',
      part: 'snippet',
      q: `${searchTerm}`,
      key: 'AIzaSyCqJXBeMiVGZJzIUVoZYxYcMbyfOEc19AY'
    },
    success: callback
  };
  $.ajax(settings);
}

function renderResult(thumb_url, videoId) {
  // console.log(`renderResult ran and was passed ${thumb_url}`);
  return `
    <div id="thumbnail">
      <a target="iframe_a" data-src="${thumb_url}" \
      href="https://www.youtube.com/embed/${videoId}?controls=1"><img src="${thumb_url}" alt="An"/></a>
    </div>
  `;
}

function displayYouTubeSearchData(data) {
  console.log(data);
  const results = data.items.map((item, index) => renderResult(item.snippet.thumbnails.medium.url, item.id.videoId));
  // console.log(`results are: ${results}`);
  $('.gallery').html(results);
  $(handleThumbNailClicks);
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

//============================================================
//Vanilla JS for modal window close
let modal = document.getElementById('modal-container');
let closeBtn = document.getElementById('closeBtn');
// Listen for close click
closeBtn.addEventListener('click', closeModal);

// Function to close modal
function closeModal(){
  //Need to stop video too.
  $('#current_frame')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');    
   modal.style.display = 'none';
}
//=============================================================


function handleThumbNailClicks(){
  $('a').click(function(event){
    // event.preventDefault();
    console.log("Registered click");
    
    $('.modal').fadeIn(600);
  });
}

$(handleThumbNailClicks);


