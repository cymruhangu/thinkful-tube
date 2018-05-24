'use strict';

(function(){
  const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
 
  
  function getDataFromApi(query, callback) {
    const settings = {
      type: 'GET',
      url: YOUTUBE_SEARCH_URL,
      dataType: 'json',
      data: {
        maxResults: '28',
        part: 'snippet',
        q: `${query}`,
        key: 'AIzaSyCqJXBeMiVGZJzIUVoZYxYcMbyfOEc19AY'
      },
      success: callback
    };
    $.ajax(settings);
  }

  function getNextPage(token){
    const settings = {
      type: 'GET',
      url: YOUTUBE_SEARCH_URL,
      dataType: 'json',
      data: {
        maxResults: '28',
        part: 'snippet',
        q: 'Pat Martino',
        pageToken: `${token}`,
        key: 'AIzaSyCqJXBeMiVGZJzIUVoZYxYcMbyfOEc19AY'
      },
      success: callback
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

  function displayYouTubeSearchData(data) {
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
