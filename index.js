
(function(){
'use strict';
  const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
  const APIkey = 'AIzaSyCqJXBeMiVGZJzIUVoZYxYcMbyfOEc19AY';
  const maxResults = 40;
  let firstPage = true;
  let lastPage = false;
  let pageNum = 1;
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
      pageNum = 1;
      sessionStorage.setItem('searchTerm', query);
      getDataFromApi(token, displayYouTubeSearchData);
    });
  }

  function getDataFromApi(token, callback){ 
    const settings = {
      type: 'GET',
      url: YOUTUBE_SEARCH_URL,
      dataType: 'json',
      data: {
        maxResults: `${maxResults}`,
        part: 'snippet',
        q: sessionStorage.getItem('searchTerm'),
        key: `${APIkey}`,
        pageToken: token
      },
      success: callback,
      error: function(request, status, error){
        console.log(error);
        if(error.code === 400){
          console.log("Back at first page");
          firstPage = true;
        }
      }
    };
    $.ajax(settings);
  }

  function displayYouTubeSearchData(data) {  //this should do it for all requests
    // console.log(data);
    let nextPg = data.nextPageToken;
    let prevPg = data.prevPageToken;
    sessionStorage.setItem('nextPageToken', nextPg);
    sessionStorage.setItem('prevPageToken', prevPg);
    const results = data.items.map((item, index) => renderResult(item.snippet.thumbnails.medium.url, item.id.videoId, item.snippet.title));
    $('.gallery').html(results);
    $('.results').prop('hidden',false);
    $(handleThumbNailClicks);
    setState(prevPg, nextPg);
  }

  function setState(previous, next){
    if(previous === undefined){ 
      $('#previous').css('display', 'none');
      $('#next').css('display', 'inline-block');
      $('#page-display').html('Displaying videos 1 to 40');
      $('#page-display').css('hidden' , false);
      firstPage = false;
    }else if(next === undefined){ //last page
      //show only prev button
      console.log('last page!');
      $('#next').css('display', 'none');
      lastPage = true;
    }else {
      $('#previous').css('display', 'inline-block');
      $('#next').css('opacity', 'inline-block');
    }
    //Remove previously called event handlers
    setResultNums();
    $('button').off();  
    nextButton();
    previousButton();
  }

  function setResultNums(){
    let result1 = (pageNum * maxResults) - 39;
    let result2 = pageNum * maxResults;
    $('#page-display').html(`Displaying videos ${result1} to ${result2}`);
    $('#page-display').css('hidden' , false);
  }

function renderResult(thumb_url, videoId, title) {
    return `
        <a class="thumbnail" target="iframe_a" src="${thumb_url}" \
        href="https://www.youtube.com/embed/${videoId}?html5=1&enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=1" frameborder="0" allowfullscreen"><img src="${thumb_url}" alt="${title}"/><span class="playBtn"><img src=
        "http://wptf.com/wp-content/uploads/2014/05/play-button.png" width="50" height="50" alt="play button"></span>
        <figcaption>${title}</figcaption>
        </a>
        <figcaption>${title}</figcaption>
    `;
  }

  function nextButton() {
    $('#next').on('click', function(event) {
      event.preventDefault();
      getDataFromApi(sessionStorage.getItem('nextPageToken'), displayYouTubeSearchData);
      pageNum++;
    });
  };

  function previousButton(token){
    $('#previous').on('click', function(event){
      event.preventDefault();
      getDataFromApi(sessionStorage.getItem('prevPageToken'),displayYouTubeSearchData);
      pageNum--;
    });
  }

  //This should be refactored into a function
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
      $('.modal').fadeIn(600, function(){
        $(document).keydown(function(event) {
        // ESCAPE key pressed
          if (event.keyCode == 27) {
            console.log("escape key pressed!");
            closeModal();
          }
        });
      });
      $('.playBtn').fadeOut(100);
      //put DOM focus into iframe so that youtube control features can be accessed. 
      document.getElementById('youtube-frame').focus();
      //Enable escape key to close modal
    });
  }
})();
