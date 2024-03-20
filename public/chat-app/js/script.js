var oldDataGlobal;
console.log(oldDataGlobal)
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

    oldDataGlobal = [];

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
                    oldDataGlobal = response.oldData;
                    console.log(oldDataGlobal,"sysdfs")
                    var message = response.data.message;
                    var image = response.user.image;

                    var currentTime = response.data.message_time;
                    var getTimeArray = currentTime.split(":");
                    var formattedTime = getTimeArray.slice(0, 2).join(":");

                    var messagesBox = $(".messages");
                    var isDateAvailable =
                    isTodayMessageAvailable(oldDataGlobal);
                    console.log(isDateAvailable)
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

                    if ($(".messages .dateShow").length) {
                        $(".messages .dateShow").remove();
                    }
                    var currentDayCheck = "";

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
                        } else {
                            className = "replies";
                            Image = receiverImage;
                            timeClass = "replytime";
                        }

                        var sentBox = `
                            <li class="${className}">
                                <img src="/chat-app/${Image}" alt="" />
                                <p>${el.message}</p>
                            </li>
                            <div class="${timeClass}">
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

            if (
                sender_id == data.chatData.receiver_id &&
                receiver_id == data.chatData.sender_id
            ) {
                console.log(data.chatData.receiver_id, "hello");
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
                `;
                $(".messages").append(receive);
            }
        }
    );

    Echo.join("status-check")
        .here((user) => {
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
});
