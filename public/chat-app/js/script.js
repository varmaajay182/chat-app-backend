

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
    // localStorage.removeItem('unseenMessages');

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
                    scrollToBottom()
                    oldDataGlobal = response.oldData;
            
                    var message = response.data.message;
                    var image = response.user.image;

                    var currentTime = response.data.message_time;
                    var getTimeArray = currentTime.split(":");
                    var formattedTime = getTimeArray.slice(0, 2).join(":");

                    var messagesBox = $(".messages");
                    var isDateAvailable =
                        isTodayMessageAvailable(oldDataGlobal);
                  
                    if (!isDateAvailable) {
                      
                        var extraDiv = `
                                <div class="dateShow">
                                    <div class="dateShowInnerDiv">
                                        <p>Today</p>
                                    </div>
                                </div>
                            `;
                        messagesBox.append(extraDiv);
                    }
                    // 
                    // 
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
            success: function (data) {
                  
                localStorage.removeItem('unseenMessages');
               
                var unseenNumberElement = $('.unseenNumber')

                unseenNumberElement.css({
                    'display': 'none',
                });
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
                // var isDateAvailable =
                //     isTodayMessageAvailable(oldDataGlobal);
              
                // if (!isDateAvailable) {
                  
                //     var extraDiv = `
                //             <div class="dateShow">
                //                 <div class="dateShowInnerDiv">
                //                     <p>Today</p>
                //                 </div>
                //             </div>
                //         `;
                //     messagesBox.append(extraDiv);
                // }

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
        // console.log(data,'data')
        // console.log(data.message.length)

        if(data.message.length !== 0){
            if (
                sender_id == data.message[0].receiver_id &&
                receiver_id == data.message[0].sender_id
            ){

               
            }
            else{
                // console.log('else')
                updateUnseenMessageCount(data);
    
                updateUnseenMessageUI(data);
            }
        }else{
            console.log(sender_id)
            console.log(receiver_id)
            var sentTickIcon = $('.senttime i.fa-check');
            // console.log(sentTickIcon)

        
            var svgElement = $('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" id="double-check"><path fill="#5E94FF" fill-rule="evenodd" d="M16.5303 6.46967C16.8232 6.76256 16.8232 7.23744 16.5303 7.53033L6.53033 17.5303C6.38968 17.671 6.19891 17.75 6 17.75 5.80109 17.75 5.61032 17.671 5.46967 17.5303L1.46967 13.5303C1.17678 13.2374 1.17678 12.7626 1.46967 12.4697 1.76256 12.1768 2.23744 12.1768 2.53033 12.4697L6 15.9393 15.4697 6.46967C15.7626 6.17678 16.2374 6.17678 16.5303 6.46967zM22.5303 6.46966C22.8232 6.76254 22.8232 7.23742 22.5303 7.53032L12.5308 17.5303C12.2379 17.8232 11.7631 17.8232 11.4702 17.5304L9.96975 16.0304C9.67681 15.7376 9.67674 15.2627 9.96959 14.9697 10.2624 14.6768 10.7373 14.6767 11.0303 14.9696L12.0004 15.9394 21.4697 6.46968C21.7625 6.17678 22.2374 6.17677 22.5303 6.46966z" clip-rule="evenodd"></path></svg>');
            
           
            sentTickIcon.replaceWith(svgElement);
        }
        //   console.log(sender_id, 'auth-sender')
        //     console.log(receiver_id, 'receiver')
        //     console.log(data.message[0].receiver_id, 'database receiver_id')
        //     console.log(data.message[0].sender_id, 'database sender_id')

      
      

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
