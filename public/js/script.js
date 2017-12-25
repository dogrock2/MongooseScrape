$().ready(function () {

    getSavedCnt();


    $('.modal1OkBtn').on('click', function () {
        $.get('/', function (data) {
            window.location.href = "/";
        });
    });
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

    function getSavedCnt() {
        $.get('/getCnt', function (data) {
            $(".savedCntSpan").text(data.length);
        });
    }


});