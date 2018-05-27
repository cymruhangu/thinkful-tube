
(function(){
'use strict';
  const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
  const APIkey = 'AIzaSyCqJXBeMiVGZJzIUVoZYxYcMbyfOEc19AY';
  let firstPage = true;
  // sessionStorage.clear();
  let lastPage = false;
  let token = '';

getSearchTerm();

function getSearchTerm() {
    $('.js-search-form').submit( event=> {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      // clear out the input
      queryTarget.val("");
      let searchTerm = query;
      sessionStorage.setItem('searchTerm', query);
      getDataFromApi(token, displayYouTubeSearchData);
    });
  }

  function getDataFromApi(token, callback){ 
    //if initial search -- if token is blank or null -- called by submit
    //else it was called by next or previous
    const settings = {
      type: 'GET',
      url: YOUTUBE_SEARCH_URL,
      dataType: 'json',
      data: {
        maxResults: '28',
        part: 'snippet',
        // q: `${sTerm}`,
        q: sessionStorage.getItem('searchTerm'),
        key: `${APIkey}`,
        pageToken: token
      },
      success: callback,
      error: function(request, status, error){
        console.log(request.responseText);
      }
    };
    $.ajax(settings);
  }

  function displayYouTubeSearchData(data) {  //this should do it for all requests
    console.log(data);
    sessionStorage.setItem('nextPageToken', data.nextPageToken);
    sessionStorage.setItem('prevPageToken', data.prevPageToken);
    const results = data.items.map((item, index) => renderResult(item.snippet.thumbnails.medium.url, item.id.videoId, item.snippet.title));
    // console.log(`previousPageToken is: ${}`);
    $('.gallery').html(results);
    $(handleThumbNailClicks);
    nextButton();
    previousButton();
  }

  function renderResult(thumb_url, videoId, title) {
    return `
      <div class="thumbnail">
        <a target="iframe_a" src="${thumb_url}" \
        href="https://www.youtube.com/embed/${videoId}?enablejsapi=1&version=3&playerapiid=ytplayer" frameborder="0" allowfullscreen"><img src="${thumb_url}" alt="An"/><span class="playBtn"><img src=
        "http://wptf.com/wp-content/uploads/2014/05/play-button.png" width="50" height="50" alt=""></span></a>
        <figcaption>${title}</figcaption>
      </div>
    `;
  }

  function getNextPage(token){
    const settings = {
      type: 'GET',
      url: YOUTUBE_SEARCH_URL,
      dataType: 'json',
      data: {
        maxResults: '5',
        part: 'snippet',
        q: sessionStorage.getItem('searchTerm'),
        pageToken: 'token',
        key: `${APIkey}`
      }
      // success: callback
    };
    let nextData = $.ajax(settings);
    // const results = nextData.map((item, index) => renderResult(item.snippet.thumbnails.medium.url, item.id.videoId, item.snippet.title));
    console.log(nextData);
  }

  function nextButton() {
    $('#next').on('click', function(event) {
      event.preventDefault();
      getDataFromApi(sessionStorage.getItem('nextPageToken'), displayYouTubeSearchData);
    });
  };

  function previousButton(token){
    $('#previous').on('click', function(event){
      event.preventDefault();
      console.log("previous clicked!");
      getDataFromApi(sessionStorage.getItem('prevPageToken'),displayYouTubeSearchData);
    });
  }

  //Vanilla JS for modal window close
  let modal = document.getElementById('modal-container');
  let closeBtn = document.getElementById('closeBtn');
  // Listen for close click
  closeBtn.addEventListener('click', closeModal);

  // Function to close modal
  function closeModal(){
    modal.style.display = 'none';
    //Stop video
    $('.youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
  }

  function handleThumbNailClicks(){
    $('.thumbnail').click(function(event){
      // event.preventDefault();
      console.log("Registered click");
      $('.modal').fadeIn(600);
      $('.playBtn').fadeOut(100);
    });
  }
})();
