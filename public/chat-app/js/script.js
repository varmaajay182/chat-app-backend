

var oldDataGlobal;
var unseenmessages;

function isTodayMessageAvailable(data) {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    var todayDateString = yyyy + "-" + mm + "-" + dd;

    var todayCount = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].message_date === todayDateString) {
            todayCount++;
        }
    }
    return todayCount <= 1 ? false : true;
}


$(document).ready(function () {
    localStorage.removeItem('unseenMessages');

    oldDataGlobal = [];
    updateUnseenMessageUI();

    $(".contact").click(function () {

        var startchat = $(".startChat").css({
            display: "none",
        });
        var content = $(".content").css({
            display: "block",
        });

        var imgTag = $(this).find("img").attr("src");
        var side_id = $(this).attr("id");
        var receivId = side_id.split("_")[1];
        var nameTag = $("#" + side_id)
            .find(".meta .name")
            .text();

        $(".contact-profile").empty();

        var clickProfile =
            `
            <img src="` +
            imgTag +
            `" alt="" />
            <div class="nameStatus">
                <p>` +
            nameTag +
            `</p><br/>
                
            </div>
        `;

        $(".contact-profile").append(clickProfile);

        // statusCheck(imgTag,receivId,nameTag)
        var getId = $(this).attr("data-id");
        receiver_id = getId;

        // var unseenMessages = JSON.parse(localStorage.getItem('unseenMessages'));
        // if (unseenMessages) {
        //     if (unseenMessages.sender_id == receiver_id) {
        //         console.log('helo')
        //         console.log(unseenMessages)
        //           
        //     }
        // }


        oldChatLoad(receiver_id);
    });

    $("#getMessage").submit(function (e) {
        e.preventDefault();
        var getMessage = $(".form-control").val();
        $(".form-control").val("");
        $.ajax({
            url: "/save-chat",
            type: "post",
            data: {
                sender_id: sender_id,
                receiver_id: receiver_id,
                message: getMessage,
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                if (response.success) {
                    scrollToBottom()
                    oldDataGlobal = response.oldData;
                    // console.log(oldDataGlobal,"sysdfs")
                    var message = response.data.message;
                    var image = response.user.image;

                    var currentTime = response.data.message_time;
                    var getTimeArray = currentTime.split(":");
                    var formattedTime = getTimeArray.slice(0, 2).join(":");

                    var messagesBox = $(".messages");
                    var isDateAvailable =
                        isTodayMessageAvailable(oldDataGlobal);
                    // console.log(isDateAvailable)
                    if (!isDateAvailable) {
                        console.log('if')
                        var extraDiv = `
                                <div class="dateShow">
                                    <div class="dateShowInnerDiv">
                                        <p>Today</p>
                                    </div>
                                </div>
                            `;
                        messagesBox.append(extraDiv);
                    }

                    var sentBox = `
                        <li class="sent">
                            <img src="/chat-app/${image}" alt="" />
                            <p>${message}</p>  
                        </li>
                        <div class="senttime">
                           <i class="fa-solid fa-check"></i>
                            <p>${formattedTime}</p>
                        </div>
                    `;
                    messagesBox.append(sentBox);
                }
            },

            error: function (response) {
                console.log(response);
            },
        });
    });

    function scrollToBottom() {
        $('.messages').animate({
            scrollTop: $('.messages').offset().top + $('.messages')[0].scrollHeight
        }, 0)
    }

    function formatDate(date) {
        var options = { year: "numeric", month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    }

    function oldChatLoad(receiver_id) {
        $.ajax({
            url: "/load-chat",
            type: "post",
            data: {
                sender_id: sender_id,

                receiver_id: receiver_id,
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                $(".messages").empty();

                if (response.success) {

                    var message = response.data;
                    var senderImage = response.senderImage.image;
                    var receiverImage = response.receiverImage.image;
                    var className;
                    var Image;
                    var timeClass;
                    var currentDay;
                    var iconClass;

                    var key = 'click'

                    if ($(".messages .dateShow").length) {
                        $(".messages .dateShow").remove();
                    }
                    var currentDayCheck = "";

                    if (message.length !== 0) {
                        updateUnseenMessage(message, key)
                    }


                    message.forEach((el) => {
                        var currentTime = el.message_time;
                        var getTimeArray = currentTime.split(":");
                        var formattedTime = getTimeArray.slice(0, 2).join(":");

                        var currentDate = el.message_date;
                        var messageDate = new Date(currentDate);
                        var messageDateFormat = formatDate(messageDate);

                        var currentDateJquery = new Date();
                        var currentDateformat = formatDate(currentDateJquery);

                        var yesterday = new Date(currentDateJquery);
                        yesterday.setDate(currentDateJquery.getDate() - 1);
                        var yesterdayDateformat = formatDate(yesterday);

                        var messagesBox = $(".messages");

                        if (currentDate !== messageDateFormat) {
                            if (messageDateFormat == currentDateformat) {
                                currentDay = "Today";
                            } else if (
                                messageDateFormat == yesterdayDateformat
                            ) {
                                currentDay = "Yesterday";
                            } else {
                                currentDay = messageDateFormat;
                            }
                            if (currentDay !== currentDayCheck) {
                                var extraDiv = `
                                <div class="dateShow">
                                    <div class="dateShowInnerDiv">
                                        <p>${currentDay}</p>
                                    </div>
                                </div>
                            `;
                                messagesBox.append(extraDiv);

                                currentDayCheck = currentDay;
                            }
                        }

                        if (sender_id == el.sender_id) {
                            className = "sent";
                            Image = senderImage;
                            timeClass = "senttime";
                            iconClass = "fa-solid fa-check"
                        } else {
                            className = "replies";
                            Image = receiverImage;
                            timeClass = "replytime";
                            iconClass = "";
                        }

                        var sentBox = `
                            <li class="${className}">
                                <img src="/chat-app/${Image}" alt="" />
                                <p>${el.message}</p>
                            </li>
                            <div class="${timeClass}">
                                <i class="${iconClass}"></i>
                                <p>${formattedTime}</p>
                            </div>
                        `;
                        messagesBox.append(sentBox);
                    });
                }
            },
            error: function (response) {
                console.log(response);
            },
        });
    }

    function updateUnseenMessage(message, key) {
        // console.log(message)
        $.ajax({
            url: "/update-unseenmessage",
            type: "post",
            data: {
                key: key,
                message: JSON.stringify(message),
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                // console.log(response)
            },
            error: function (response) {
                console.log(response);
            },
        });
    }

    function yeardatmonth(DateJquery) {
        var year = DateJquery.getFullYear();
        var month = (DateJquery.getMonth() + 1).toString().padStart(2, "0");
        var day = DateJquery.getDate().toString().padStart(2, "0");
        var formattedDate = year + "-" + month + "-" + day;
        return formattedDate;
    }

    Echo.private("message-handel").listen(
        ".App\\Events\\MessageHandelEvent",
        (data) => {

            var message = data.chatData.message;
            var user = data.sender.image;

            var currentTime = data.chatData.message_time;
            var getTimeArray = currentTime.split(":");
            var formattedTime = getTimeArray.slice(0, 2).join(":");

            // var unseenNumber = $('.contact[data-id="' + receiver_id + '"]');
            // console.log(unseenNumber,'heelo')

            // console.log(sender_id, 'auth-sender')
            // console.log(receiver_id, 'receiver')
            // console.log(data.chatData.receiver_id, 'database receiver_id')
            // console.log(data.chatData.sender_id, 'database sender_id')

            if (
                sender_id == data.chatData.receiver_id &&
                receiver_id == data.chatData.sender_id
            ) {
                scrollToBottom()

                var key = "load"

                updateUnseenMessage(data.chatData, key)

                var messagesBox = $(".messages");

            //     var extraDiv = `
            //     <div class="dateShow">
            //         <div class="dateShowInnerDiv">
            //             <p>Today</p>
            //         </div>
            //     </div>
            // `;
            //     messagesBox.append(extraDiv);

                var receive =
                    `
                <li class="replies">
                    <img src="/chat-app/` +
                    user +
                    `" alt="" />
                    <p>` +
                    message +
                    ` </p>
                </li>
                <div class="replytime">
              
                <p>${formattedTime}</p>
            </div>
                `;
                $(".messages").append(receive);
            }
        }
    );

    Echo.join("status-check")
        .here((user) => {
            // console.log(user)
            for (var i = 0; i < user.length; i++) {
                if (sender_id != user[i]["id"]) {
                    $("#status-" + user[i].id)
                        .removeClass()
                        .addClass("contact-status status-online");
                    $("#preview-" + user[i].id).text("online");
                }
            }

        })
        .joining((user) => {
            $("#status-" + user.id)
                .removeClass()
                .addClass("contact-status status-online");
            $("#preview-" + user.id).text("online");
        })
        .leaving((user) => {
            $("#status-" + user.id)
                .removeClass()
                .addClass("contact-status status-offline");
            $("#preview-" + user.id)
                .text("")
                .text("offline");
        });

    Echo.private('message-seen').listen(".App\\Events\\MessageSeenEvent", (data) => {
        console.log(data)
        // var unseenMessageLength = data.message.length;

        updateUnseenMessageCount(data);

        updateUnseenMessageUI(data);


    });
});

function updateUnseenMessageCount(data) {
    // console.log(data);
    var unseenMessageLength = data.message.length;
    var receiverIdFromDatabase = data.message[0].receiver_id;
    var senderIdFormDatabase = data.message[0].sender_id

    if (sender_id == receiverIdFromDatabase) {
        var unseenMessages = {
            sender_id: senderIdFormDatabase,
            count: unseenMessageLength
        };
        localStorage.setItem('unseenMessages', JSON.stringify(unseenMessages));
    }
}

function updateUnseenMessageUI() {
    var unseenMessages = JSON.parse(localStorage.getItem('unseenMessages'));
    // console.log(unseenMessages)
    if (unseenMessages && unseenMessages.count && unseenMessages.count !== "") {
        var unseenNumber = $('.contact#user_' + unseenMessages.sender_id);

        var unseenNumberElement = unseenNumber.find('.unseenNumber');

        unseenNumberElement.css({
            'display': 'block',
            'display': 'flex',
            'justifyContent': 'center',
            'alignItems': 'center'
        });
        // console.log(unseenMessages.count);

        var ptext = unseenNumberElement.find('p').text(unseenMessages.count);
        //    console.log(ptext.text())
    } else {
        $('.unseenNumber').css('display', 'none');
    }
}
