
(function(){
'use strict';
  const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
  const APIkey = 'AIzaSyCqJXBeMiVGZJzIUVoZYxYcMbyfOEc19AY';
  let searchTerm = '';
  let nextPageToken = '';
  let prevPageToken = '';
  let lastPage = false;
  
getSearchTerm();

function getSearchTerm() {
    $('.js-search-form').submit(event => {
      console.log("getSearchTerm ran");
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      // clear out the input
      queryTarget.val("");
      searchTerm = query;
      getDataFromApi(query, displayYouTubeSearchData);
    });
  }

  function getDataFromApi(query, token, callback) { 
    //if initial search -- if token is blank or null -- called by submit
    //else it was called by next or previous
  
    console.log(`getDataFromApi ran.  searchTerm is ${searchTerm}`);
    const settings = {
      type: 'GET',
      url: YOUTUBE_SEARCH_URL,
      dataType: 'json',
      data: {
        maxResults: '28',
        part: 'snippet',
        q: `${query}`,
        key: `${APIkey}`,
        pageToken: `${nextPageToken}`
      },
      success: callback
    };
    $.ajax(settings);
  }

  function displayYouTubeSearchData(data) {  //this should do it for all requests
    let nextPageToken = data.nextPageToken;
    console.log(`nextPageToken is ${nextPageToken}`);
    const results = data.items.map((item, index) => renderResult(item.snippet.thumbnails.medium.url, item.id.videoId, item.snippet.title));
    // console.log(`results are: ${results}`);
    $('.gallery').html(results);
    $(handleThumbNailClicks);
    // $(handleThumbNailHover);
    // $(handlePlayBtn);
    nextButton(nextPageToken);
  }

  function renderResult(thumb_url, videoId, title) {
    // console.log(`title is:  ${title}`);
    return `
      <div class="thumbnail">
        <a target="iframe_a" data-src="${thumb_url}" \
        href="https://www.youtube.com/embed/${videoId}?controls=1"><img src="${thumb_url}" alt="An"/><span class="playBtn"><img src="http://wptf.com/wp-content/uploads/2014/05/play-button.png" width="50" height="50" alt=""></span></a>
          <span class="playBtn"><img src="http://wptf.com/wp-content/uploads/2014/05/play-button.png" width="50" height="50" alt=""></span>
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
        maxResults: '28',
        part: 'snippet',
        q: `${searchTerm}`,
        pageToken: `${token}`,
        key: `${APIkey}`
      }
      // success: callback
    };
    let nextData = $.ajax(settings);
    console.log(nextData);
  }

  function nextButton(token) {
    $('#next').on('click', function(event) {
      event.preventDefault();
      getDataFromApi(searchTerm, token, renderResult);
    });
  };

  function previousButton(token){
    $('#previous').on('click', function(event){
      event.preventDefault();
      getDataFromApi(searchTerm, token, renderResult);
    });
  }

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
    $('.thumbnail').click(function(event){
      // event.preventDefault();
      console.log("Registered click");
      $('.modal').fadeIn(600);
    });
  }


// function handlePlayBtn(){
//   $('.playBtn').click(function(){
//     console.log("playBtn clicked");
//     $('.playBtn').css('display', 'none');
//   })
// }
})();
