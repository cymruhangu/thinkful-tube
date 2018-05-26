
(function(){
'use strict';
  const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
  const APIkey = 'AIzaSyCqJXBeMiVGZJzIUVoZYxYcMbyfOEc19AY';
  let searchTerm = '';
  let nextPageToken = '';
  let prevPageToken = '';
  let lastPage = false;
  
  
  function controlsListen(){
  $('a.play-video').click(function(){
  $('.youtube-video')[0].contentDocument.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
  } );

  $('a.stop-video').click(function(){
    let vid = $('youtube-video')[0];
    console.log(`vid is:  ${vid}`);
  // $('.youtube-video')[0].contentDocument.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
  });

  $('a.pause-video').click(function(){
    $('.youtube-video')[0].contentDocument.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
}



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

  function getDataFromApi(query, callback) { 
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
      getNextPage(token);
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
    modal.style.display = 'none';
    //Need to stop video too.
    $('.youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');    
     
  }
  //=============================================================


  function handleThumbNailClicks(){
    $('.thumbnail').click(function(event){
      // event.preventDefault();
      console.log("Registered click");
      $('.modal').fadeIn(600);
        // controlsListen();

      $('.playBtn').fadeOut(100);
    });
  }


 $(".stop-video").click(function() {
        $('.youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');    
});


})();
