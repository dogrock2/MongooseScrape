$().ready(function () {

    //When page loads calls a function to get the count of saved articles.
    getSavedCnt();

    /**
     * After scraping, the modal pops up and this gets executed 
     * after you hit the OK button. This code calls the default
     * route and refreshes the page to show all scraped data.
     */
    $('.modal1OkBtn').on('click', function () {
        $.get('/', function (data) {
            window.location.href = "/";
        });
    });
    
    //Calls route to scrape NYTimes and show modal.
    $('#scrapeBtn').on('click', function () {
        $.get('/scrape', function (data) {
            $('#mainModalQty').text(data.length);
            $('#myModalSmall').modal({
                keyboard: false
            });
        });
    });

    //Closes modal
    $('#myModalSmall').on('click', function () {
        $('#myModalSmall').modal('hide');
    });

    /**
     * When you hit a save article button it gets the data from the 
     * article that was clicked and then saved to the mongo db.
     */
    $("#resultsDivMain").on('click', '.saveBtn', function () {
        let current = $(this);
        let currentDiv = $(this).parents('.newDiv');
        let title = currentDiv.children('span.titleSpan').text();
        let desc = currentDiv.children('p.newsDesc').text();
        let img = currentDiv.children('img').attr('src');
        let link = currentDiv.children('div.row').children('div.col-md-11').children('a').attr('href');

        let articleData = {
            title: title,
            link: link,
            desc: desc,
            image: img
        };

        $.post('/saving', articleData, function (data) {
            if (data === '11000') {
                console.log('Duplicate error.');
                currentDiv.remove();
            } else if (data === 'ok') {
                currentDiv.remove();
                getSavedCnt();
            }
        });
    });

    /**
     * Gets the count of all the saved articles in the database.
     */
    function getSavedCnt() {
        $.get('/getCnt', function (data) {
            $(".savedCntSpan").text(data.length);
        });
    }


});