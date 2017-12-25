$().ready(function () {

    $("#resultsDivSaved").on('click', '.deleteBtn', function () {
        let current = $(this);
        let currentDiv = $(this).parents('.newDiv');
        let title = currentDiv.children('span.titleSpan').text();
        let desc = currentDiv.children('p.newsDesc').text();
        let img = currentDiv.children('img').attr('src');
        let link = currentDiv.children('div.row').children('div.col-md-11').children('a').attr('href');

        let titleData = {
            title: title
        };

        $.ajax({
            url: '/delete',
            type: 'DELETE',
            data: titleData,
            success: function (data) {
                if (data === 'error') {
                    console.log('Error Deleting.');
                } else {
                    currentDiv.remove();
                    getSavedCnt();
                    if ($("#resCnt").children().length < 1)
                        emptyDiv();
                }
            }
        });
    });
    $("#resultsDivSaved").on('click', '.msgBtn', function () {
        let current = $(this);
        let currentDiv = $(this).parents('.newDiv');
        let title = currentDiv.children('span.titleSpan').text();

        $('#modal2Title').text(title);
        $('#myModal2').modal({
            keyboard: false
        });
        displaySavedMessages(title);

    });

    $("#modal2SaveBtn").on('click', function () {

        let title = $('#modal2Title').text();

        let info = {
            msg: $('#message-text').val().trim(),
            title: title
        };

        $.post('/saved/setMessages', info, function (data) {
            if (data === 'ok') {
                $('#message-text').val('');
                displaySavedMessages(title);
            }
        });
    });

    function displaySavedMessages(title) {
        let currentTitle = {
            title: title
        };
        $.post('/saved/getMessages', currentTitle, function (data) {
            if (data === 'err')
                console.log("Error occurred!");
            else if (data && data.length > 0) {
                $("#modal2SavedMsg").text('');
                $("#modal2SavedMsg").empty();
                for (let i = 0; i < data.length; i++) {
                    for (let x = 0; x < data[i].msg.length; x++) {
                        $("#modal2SavedMsg").append(`
                            <div class="row msgContainerDiv" attrId="${data[i].msg[x]._id}" attrTitle="${title}">
                                <div class="col-md-10 font-italic msgDivTitle">${data[i].msg[x].body}</div>
                                <div class="col-md-2">
                                    <a><img src="../images/x.png" class="mb-1 xImg"></a>
                                </div>
                            </div>
                        `);
                    }
                }
                if ($("#modal2SavedMsg").children().length < 1)
                    $("#modal2SavedMsg").append('<span>There are no messages.</span>');
            }
        });
    }


    $('#modal2SavedMsg').on('click', '.xImg', function () {
        let current = $(this);
        let currentDiv = $(this).parents('div.msgContainerDiv');
        let id = currentDiv.attr('attrId');
        let title = currentDiv.attr('attrTitle');
        deleteSpecificMessage(id, title);
    });


    function deleteSpecificMessage(id, title) {
        let idPassed = {
            _id: id
        };
        $.ajax({
            url: '/MSGdelete',
            type: 'DELETE',
            data: idPassed,
            success: function (data) {
                if (data === 'error')
                    console.log('Error Deleting.');
                else
                    displaySavedMessages(title);
            }
        });
    }

    function emptyDiv() {
        let wrapDiv2 = $("<div>");
        wrapDiv2.addClass('bg-warning rounded text-center text-light font-weight-bold my-1 py-2');
        wrapDiv2.append("<span class='containerMsg'><h2>NO SAVED ARTICLES.</h2> </span>");
        $('#resultsDivSaved').append(wrapDiv2);
    }

    function getSavedCnt() {
        $.get('/getCnt', function (data) {
            $(".savedCntSpan").text(data.length);
        });
    }


});