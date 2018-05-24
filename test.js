<body>

  <div class="youtube-feed container">
    <script id="template" type=test/template>
      <div class="youtube-item">
        <a href="{{link}}" class="link">
          <img src="{{thumb}}" alt="">
        </a>
        <div class="info">
          <h6 class="title">{{title}}</h6>
          <p>{{channel}}</p>
          <p>{{views}}</p>
        </div>
      </div>
    </script>
  </div>

  <div class="button container">
    <a href="#" id="next">Next Page</a>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

  <script>
    (function() {
      var query = 'TANNOY dvs 6',
        apiKey = 'YOUR_API_KEY';

      var reachLastPage = false;

      getData();

      function getData() {
        $.get('https://www.googleapis.com/youtube/v3/search', {
            part: 'snippet, id',
            q: query,
            type: 'video',
            maxResults: 10,
            key: apiKey
          },
          function(data) {

            $.each(data.items, function(i, item) {
              var resultsData = {
                id: item.id.videoId,
                title: item.snippet.title,
                desc: item.snippet.description,
                thumb: item.snippet.thumbnails.medium.url,
                channel: item.snippet.channelTitle
              };

              $.get('https://www.googleapis.com/youtube/v3/videos', {
                  part: 'statistics',
                  id: resultsData.id,
                  key: apiKey
                },
                function(data) {
                  $.each(data.items, function(i, item) {
                    var views = item.statistics.viewCount;
                    resultsData.viewCount = views;
                  });
                  renderData(resultsData);
                });
            });

            if (data.nextPageToken) {
              console.log("go to token : " + data.nextPageToken);
              nextButton(data.nextPageToken);
            } else {
              console.log("no page left");
              reachLastPage = true;
            }
          });
      };

      function renderData(obj) {
        var template = $.trim($('#template').html()),
          dataVals = template.replace(/{{id}}/ig, obj.id)
          .replace(/{{title}}/ig, obj.title)
          .replace(/{{thumb}}/ig, obj.thumb)
          .replace(/{{channel}}/ig, obj.channel)
          .replace(/{{views}}/ig, obj.viewCount)
          .replace(/{{link}}/ig, 'https://www.youtube/com/embed/' + obj.id);
        $(dataVals).appendTo('.youtube-feed');
      };

      function nextButton(token) {
        $('#next').off('click').on('click', function(e) {
          e.preventDefault();
          if (!reachLastPage) {
            nextPage(token);
          } else {
            console.log("we already have reached last page!");
          }
        });
      };

      function nextPage(token) {
        $.get('https://www.googleapis.com/youtube/v3/search', {
            part: 'snippet, id',
            q: query,
            type: 'video',
            maxResults: 2,
            pageToken: token,
            key: apiKey
          },
          function(data) {

            $.each(data.items, function(i, item) {
              var resultsData = {
                id: item.id.videoId,
                title: item.snippet.title,
                desc: item.snippet.description,
                thumb: item.snippet.thumbnails.medium.url,
                channel: item.snippet.channelTitle
              };

              $.get('https://www.googleapis.com/youtube/v3/videos', {
                  part: 'statistics',
                  id: resultsData.id,
                  key: apiKey
                },
                function(data) {
                  $.each(data.items, function(i, item) {
                    var views = item.statistics.viewCount;
                    resultsData.viewCount = views;
                  });
                  renderData(resultsData);
                });
            });
            if (data.nextPageToken) {
              console.log("go to token : " + data.nextPageToken);
              nextButton(data.nextPageToken);
            } else {
              console.log("no page left");
              reachLastPage = true;
            }
          });
      };
    })();
  </script>

</body>
 Run code snippetRet