
var unseenmessages;

$(document).ready(function () {
    // localStorage.removeItem('unseenMessages');


    // var storedState = localStorage.getItem('unseenNumberState');
    // console.log(storedState)


    function scrollToBottom() {
        $('.messages').animate({
            scrollTop: $('.messages').offset().top + $('.messages')[0].scrollHeight
        }, 0)
    }

    function formatDate(date) {
        var options = { year: "numeric", month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    }

    //Contact Click And Old Chat Reload
    $(".contact").click(function () {

        var startchat = $(".startChat").css({
            display: "none",
        });
        var content = $(".content").css({
            display: "block",
        });

        var backIncon;

        if ($(window).width() <= 600) {
            backIncon = "<div class='backIcon'><i class='fa fa-arrow-left' aria-hidden='true'></i></div>"
        } else {
            backIncon = ""
        }

        var imgTag = $(this).find("img").attr("src");
        var side_id = $(this).attr("id");
        var receivId = side_id.split("_")[1];
        var nameTag = $("#" + side_id)
            .find(".meta .name")
            .text();

        $(".contact-profile").empty();

        var clickProfile =
            `
            ${backIncon}
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

    //Old Chat reload Api
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

                    var messages = response.data;
                    var senderImage = response.senderImage.image;
                    var receiverImage = response.receiverImage.image;
                    var className;
                    var Image;
                    var timeClass;
                    var currentDay;
                    var iconClass;
                    var deleteIcon;
                    var editIcon;
                    var chatImage;

                    var key = 'click'

                    if ($(".messages .dateShow").length) {
                        $(".messages .dateShow").remove();
                    }
                    var currentDayCheck = "";

                    if (response.unseenMessage.length != 0) {
                        if (sender_id != response.unseenMessage[0].sender_id) {
                            updateUnseenMessage(response.unseenMessage, key)
                        }
                    }

                    messages.forEach((el) => {

                        if (el.updated_at != null) {
                            var currentTime = el.updated_at;
                            var getTimeArray = currentTime.split(":");
                            var formattedTime = getTimeArray.slice(0, 2).join(":");

                            var editedIcon = '<i class="fas fa-pencil-alt" id="messageEditIcon"></i>'

                        } else {
                            var currentTime = el.message_time;
                            var getTimeArray = currentTime.split(":");
                            var formattedTime = getTimeArray.slice(0, 2).join(":");

                            var editedIcon = "";
                        }

                        var message;
                        var pTagStyle = "";
                        // console.log(el)

                        if (el.Image != null) {
                            message = '<img src="' + el.Image + '" alt="No Image">'
                            pTagStyle = "background:none;";
                        } else {
                            message = el.message;
                        }


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
                                <div class="dateShow" id="days_${el.id}">
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
                            chatImage = "";
                            deleteIcon = '<i class="fa fa-trash action" aria-hidden="true" id="delete_' + el.id + '"></i> '
                            if (el.Image != null) {
                                editIcon = "";
                            } else {
                                editIcon = '<i class="fas fa-edit action" id="messageEdit_' + el.id + '"></i>'
                            }
                            if (el.seen_at != null) {
                                iconClass = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" id="double-check"><path fill="#5E94FF" fill-rule="evenodd" d="M16.5303 6.46967C16.8232 6.76256 16.8232 7.23744 16.5303 7.53033L6.53033 17.5303C6.38968 17.671 6.19891 17.75 6 17.75 5.80109 17.75 5.61032 17.671 5.46967 17.5303L1.46967 13.5303C1.17678 13.2374 1.17678 12.7626 1.46967 12.4697 1.76256 12.1768 2.23744 12.1768 2.53033 12.4697L6 15.9393 15.4697 6.46967C15.7626 6.17678 16.2374 6.17678 16.5303 6.46967zM22.5303 6.46966C22.8232 6.76254 22.8232 7.23742 22.5303 7.53032L12.5308 17.5303C12.2379 17.8232 11.7631 17.8232 11.4702 17.5304L9.96975 16.0304C9.67681 15.7376 9.67674 15.2627 9.96959 14.9697 10.2624 14.6768 10.7373 14.6767 11.0303 14.9696L12.0004 15.9394 21.4697 6.46968C21.7625 6.17678 22.2374 6.17677 22.5303 6.46966z" clip-rule="evenodd"></path></svg>'
                            } else {
                                if (el.receiver_status == 1) {
                                    iconClass = "<i class='fa-solid fa-check-double'></i>"
                                } else {

                                    iconClass = "<i class='fa-solid fa-check'></i>"
                                }
                            }
                        } else {
                            className = "replies";
                            Image = receiverImage;
                            timeClass = "replytime";
                            iconClass = "";
                            deleteIcon = "";
                            editIcon = "";
                            chatImage = "<img src='/chat-app/" + receiverImage + "' alt='' />";
                        }

                        var sentBox = `
                            <li class="${className}" id="message_${el.id}">
                                ${chatImage}
                                <p style="${pTagStyle}">${message}
                                ${editedIcon}
                                </p>
                                ${deleteIcon} ${editIcon}
                            </li>
                            <div class="${timeClass}" id="sentTime_${el.id}">
                                ${iconClass}
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

    //documentt and image sparate file take
    $('#dropdown-document').click(function () {
        $('#document-file').click();
    });

    $('#dropdown-image').click(function () {
        $('#image-file').click();
    });

    //image Preview function
    $('#image-file').change(function () {
        var fileName = $(this).prop('files')[0].name;
        var inputFiled = $('#chatWrite').val(fileName)

        $('.messages').css('display', 'none');
        $('.image-preview').css('display', 'block')

        var input = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.image-preview-inner').html('<img src="' + e.target.result + '" alt="Image Preview">');
            };

            reader.readAsDataURL(input.files[0]);
        }

    });

    //form for send and edit message
    $("#sendMessageInput").off('submit').on('submit', function (e) {
        e.preventDefault();

        var formData = new FormData(this);


        var editMessageId = $("#editMessageId").val()

        var inputValue = $('.form-control').val()
        $('.form-control').val('')

        formData.append('sender_id', sender_id);
        formData.append('receiver_id', receiver_id);
        formData.append('editMessageId', editMessageId);

        if (editMessageId) {
            EditMessageFunction(formData)
        } else {
            if (inputValue !== "") {
                AddMessage(formData)
            }
        }

    });

    //save message Api
    function AddMessage(formData) {

        $.ajax({
            url: "/save-chat",
            type: "post",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                if (response.success) {
                    //    console.log(response.data)

                    var getMessages = response.data
                    $('.messages').css('display', 'block');
                    $('.image-preview').css('display', 'none')

                    scrollToBottom()
                    oldDataGlobal = response.oldData;
                    // console.log(response.oldData)

                    getMessages.forEach((getMessage) => {
                        var message;
                        var pTagStyle = "";
                        var iconChek;
                        var editIcon;

                        var unseenNumber = $('.contact#user_' + getMessage.receiver_id);
                        $('ul').prepend(unseenNumber);

                        if (getMessage.image != null) {
                            message = '<img src="' + getMessage.image + '" alt="No Image">';
                            pTagStyle = "background:none;";
                            editIcon = ""
                        } else {

                            message = getMessage.message;
                            editIcon = "<i class='fas fa-edit action' id='messageEdit_" + getMessage.id + "'></i>";
                        }

                        if (getMessage.receiver_status == 1) {
                            iconChek = '<i class="fa-solid fa-check-double"></i>'
                        } else {
                            iconChek = '<i class="fa-solid fa-check"></i>'
                        }


                        var image = response.user.image;

                        var currentTime = getMessage.message_time;
                        var getTimeArray = currentTime.split(":");
                        var formattedTime = getTimeArray.slice(0, 2).join(":");

                        var messagesBox = $(".messages");

                        if (response.oldData.length <= 1) {

                            var extraDiv = `
                                    <div class="dateShow" id="days_${response.data.id}">
                                        <div class="dateShowInnerDiv">
                                            <p>Today</p>
                                        </div>
                                    </div>
                                `;
                            messagesBox.append(extraDiv);
                        }
                        // <img src="/chat-app/${image}" alt="" />
                        var sentBox = `
                            <li class="sent" id="message_${getMessage.id}">
                              
                                <p style="${pTagStyle}">${message}</p>  
                                <i class="fa fa-trash action" aria-hidden="true" id="delete_${getMessage.id}"></i>
                                ${editIcon}
                            </li>
                            <div class="senttime" id="sentTime_${getMessage.id}">
                              ${iconChek}
                                <p>${formattedTime}</p>
                            </div>
                        `;
                        messagesBox.append(sentBox);

                        $("#sendMessageInput")[0].reset();
                    })



                }
            },

            error: function (response) {
                console.log(response);
            },
        });
    }

    //edit button function
    $(document).on('click', '.messages li.sent i.fa-edit', function () {

        var editIcon = $(this).attr('id');


        const editArray = editIcon.split('_');
        const messageId = editArray[1];

        var editMesssageId = 'messageEdit_' + messageId;
        var editElement = $('#' + editMesssageId);
        var message = editElement.parent().find('p').text();

        var input = $('#chatWrite')
        input.val(message);
        var editInput = $('#editMessageId')
        editInput.val(messageId)

    });

    //update message Api
    function EditMessageFunction(formData) {

        $.ajax({
            url: "/update-message",
            type: "post",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (data) {

                // console.log(data.updateMessage.message)

                var lielementId = 'message_' + data.updateMessage.id
                var lielement = $('#' + lielementId).find('p').text(data.updateMessage.message)

                lielement.append('<i class="fas fa-pencil-alt" id="messageEditIcon"></i>')

                // console.log(data.updateMessage.updated_at)

                var currentTime = data.updateMessage.updated_at;
                var getTimeArray = currentTime.split(":");
                var formattedTime = getTimeArray.slice(0, 2).join(":");

                var sentClass = $('#sentTime_' + data.updateMessage.id).find('p').text(formattedTime)

                // sentClass.text();
                $('.form-control').val('')
                $("#editMessageId").val("")

            },
            error: function (response) {
                console.log(response);
            },
        })
    }

    //Delete button function
    $(document).on('click', '.messages li.sent i.fa-trash', function () {
        // Store the reference to the delete icon
        var deleteIcon = $(this).attr('id');

        const deleteArray = deleteIcon.split('_');
        const messageId = deleteArray[1];
        // console.log(messageId);

        // Show SweetAlert confirmation dialog
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMessage(messageId);
            }
        });
    });

    //Delete Message Api
    function deleteMessage(messageId) {
        $.ajax({
            url: "/delete-message",
            type: "post",
            data: {
                id: messageId,
                senderId: sender_id,
                receiverId: receiver_id
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (data) {

                var deletemessageId = 'delete_' + data.deletedMessage.id;
                var deleteIconElement = $('#' + deletemessageId);
                var nextSibling = deleteIconElement.parent().next();
                nextSibling.remove();
                deleteIconElement.parent().remove();
            },
            error: function (response) {
                console.log(response);
            },
        })
    }

    //Update Seen Message Api
    function updateUnseenMessage(message, key) {

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

                if (
                    sender_id == data.seenMessage.receiver_id &&
                    receiver_id == data.seenMessage.sender_id
                ) {
                    var userId = data.seenMessage.sender_id;
                    // console.log(userId,'userID')
                    var unseenNumber = $("#user_" + userId + " .unseenNumber");

                    localStorage.removeItem('unseenMessages');

                    unseenNumber.css({
                        'display': 'none',
                    });
                }

            },
            error: function (response) {
                console.log(response);
            },
        });
    }

    //When User Offline Api Call
    function offlineStatus(userId) {
        $.ajax({
            url: "/offline-check",
            type: "post",
            data: {
                id: userId
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {

                //   console.log(response)

            },
            error: function (response) {
                console.log(response);
            },
        });
    }

    //When User Online Api call
    function onlineStatus(user) {
        $.ajax({
            url: "/online-check",
            type: "post",
            data: {
                user: user
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {

                //   console.log(response)

            },
            error: function (response) {
                console.log(response);
            },
        });
    }

    //Seen Icon Chnage When User Online Or Offline 
    function iconChange(userId) {
        $.ajax({
            url: "/icon-change",
            type: "post",
            data: {
                id: userId
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {

                //   console.log(response)

                var messages = response.messages

                messages.forEach((message) => {
                    var id = message.id

                    var icon = $('#sentTime_' + id).find('i')

                    var updateIcon = $("<i class='fa-solid fa-check-double'></i>")
                    icon.replaceWith(updateIcon);

                })


            },
            error: function (response) {
                console.log(response);
            },
        });
    }

    //Message Handel Event In Receiver Side
    Echo.private("message-handel").listen(
        ".App\\Events\\MessageHandelEvent",
        (data) => {
            // console.log(data)
            // console.log(data.chatData.Image)
            // console.log(data.chatData.Image != null)
            if (sender_id == data.chatData[0].receiver_id) {

                var unseenNumber = $('.contact#user_' + data.chatData[0].sender_id);
                $('ul').prepend(unseenNumber);

            }


            if (
                sender_id == data.chatData[0].receiver_id &&
                receiver_id == data.chatData[0].sender_id
            ) {

                var getSenderMessages = data.chatData
                getSenderMessages.forEach((getMessage) => {
                    // console.log(getMessage)

                    if (getMessage.image != null) {
                        var message = '<img src="' + getMessage.image + '" alt="No Image">'
                        var pTagStyle = "background:none;";
                    } else {
                        var message = getMessage.message;
                    }

                    var user = data.sender.image;

                    var currentTime = getMessage.message_time;
                    var getTimeArray = currentTime.split(":");
                    var formattedTime = getTimeArray.slice(0, 2).join(":");


                    scrollToBottom()

                    var key = "load"

                    updateUnseenMessage(getMessage, key)

                    var messagesBox = $(".messages");

                    if (data.oldData.length <= 1) {

                        var extraDiv = `
                                <div class="dateShow" id="days_${getMessage.id}">
                                    <div class="dateShowInnerDiv">
                                        <p>Today</p>
                                    </div>
                                </div>
                            `;
                        messagesBox.append(extraDiv);
                    }

                    var receive =
                        `
                    <li class="replies" id="message_${getMessage.id}">
                        <img src="/chat-app/` +
                        user +
                        `" alt="" />
                        <p style="${pTagStyle}">` +
                        message +
                        ` </p>
                    </li>
                    <div class="replytime">
                  
                       <p>${formattedTime}</p>
                    </div>
                    `;
                    $(".messages").append(receive);
                })

            }
        }
    );

    //Chack User Online Or Offline
    Echo.join("status-check")
        .here((user) => {
            // console.log(user)
            for (var i = 0; i < user.length; i++) {
                if (sender_id != user[i]["id"]) {
                    //    console.log(user[i])
                    $("#status-" + user[i].id)
                        .removeClass()
                        .addClass("contact-status status-online");
                    $("#preview-" + user[i].id).text("online");
                }
            }

            onlineStatus(user)

        })
        .joining((user) => {
            // console.log(user)
            $("#status-" + user.id)
                .removeClass()
                .addClass("contact-status status-online");
            $("#preview-" + user.id).text("online");

            iconChange(user.id)
        })
        .leaving((user) => {

            // console.log(user)
            $("#status-" + user.id)
                .removeClass()
                .addClass("contact-status status-offline");
            $("#preview-" + user.id)
                .text("")
                .text("offline");

            offlineStatus(user.id)
        });

    //message seen Count
    Echo.private('message-seen').listen(".App\\Events\\MessageSeenEvent", (data) => {
        // console.log('sd')
        if (data.message.length !== 0) {


            if (
                sender_id == data.message[0].receiver_id &&
                receiver_id == data.message[0].sender_id
            ) {
                
            }
            else {

                updateUnseenMessageCount(data);

                updateUnseenMessageUI(data);
            }
        }

    });

    //Count Unseen and seen message
    function updateUnseenMessageCount(data) {
        //   console.log(data.message)
        var messages = data.message
        const senderMessages = {};

        messages.sort((a, b) => a.sender_id - b.sender_id);

        messages.forEach(message => {

            if (!(message.sender_id in senderMessages)) {
                senderMessages[message.sender_id] = [];
            }
            senderMessages[message.sender_id].push(message);
        });
        // console.log(senderMessages)
        const senderArray = []
        for (const senderId in senderMessages) {
            senderArray.push(senderMessages[senderId]);
        }
        // console.log(senderArray)
        var unseenMessagesArray = [];
        for (var i = 0; i < senderArray.length; i++) {
            // console.log(senderArray[i].length)
            var unseenMessageLength = senderArray[i].length;
            var receiverIdFromDatabase = data.message[0].receiver_id;
            var senderIdFormDatabase = senderArray[i][0].sender_id

            if (sender_id == receiverIdFromDatabase) {
                var unseenMessages = {
                    sender_id: senderIdFormDatabase,
                    receiver_id: receiverIdFromDatabase,
                    count: unseenMessageLength
                };
                unseenMessagesArray.push(unseenMessages);

            }
        }
        localStorage.setItem('unseenMessages', JSON.stringify(unseenMessagesArray));
    }

    //Change Ui based On Count
    function updateUnseenMessageUI() {
        var unseenMessages = JSON.parse(localStorage.getItem('unseenMessages'));

        unseenMessages.forEach((unseenMessage) => {
            if (unseenMessage) {
                var unseenNumber = $('.contact#user_' + unseenMessage.sender_id);

                var unseenNumberElement = unseenNumber.find('.unseenNumber');

                if (unseenMessage.count > 0) {

                    unseenNumberElement.css({
                        'display': 'block',
                        'display': 'flex',
                        'justifyContent': 'center',
                        'alignItems': 'center'
                    });

                    var ptext = unseenNumberElement.find('p').text(unseenMessage.count);

                    // const listItems = $('ul li');

                    // listItems.sort(function (a, b) {
                    //     const countA = parseInt($(a).find('.unseenNumber p').text());
                    //     const countB = parseInt($(b).find('.unseenNumber p').text());

                    //     const numA = isNaN(countA) ? -Infinity : countA;
                    //     const numB = isNaN(countB) ? -Infinity : countB;

                    //     return numB - numA;
                    // });

                    // // console.log(listItems)

                    // $('ul').append(listItems);
                } else {
                    unseenNumberElement.css({
                        'display': 'none',
                    })
                }
            }
        })

    }

    //User Seen Message Seen Icon Blue At that time
    Echo.private('icon-update').listen(".App\\Events\\SeenIconUpdateEvent", (data) => {

        if (sender_id == data.database_senderId &&
            receiver_id == data.database_receiverId) {

            const sentTickIcon = $('.senttime i');

            const svgElement = $('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" id="double-check"><path fill="#5E94FF" fill-rule="evenodd" d="M16.5303 6.46967C16.8232 6.76256 16.8232 7.23744 16.5303 7.53033L6.53033 17.5303C6.38968 17.671 6.19891 17.75 6 17.75 5.80109 17.75 5.61032 17.671 5.46967 17.5303L1.46967 13.5303C1.17678 13.2374 1.17678 12.7626 1.46967 12.4697 1.76256 12.1768 2.23744 12.1768 2.53033 12.4697L6 15.9393 15.4697 6.46967C15.7626 6.17678 16.2374 6.17678 16.5303 6.46967zM22.5303 6.46966C22.8232 6.76254 22.8232 7.23742 22.5303 7.53032L12.5308 17.5303C12.2379 17.8232 11.7631 17.8232 11.4702 17.5304L9.96975 16.0304C9.67681 15.7376 9.67674 15.2627 9.96959 14.9697 10.2624 14.6768 10.7373 14.6767 11.0303 14.9696L12.0004 15.9394 21.4697 6.46968C21.7625 6.17678 22.2374 6.17677 22.5303 6.46966z" clip-rule="evenodd"></path></svg>');

            sentTickIcon.replaceWith(svgElement);
        }

    });

    //Delete Message Event
    Echo.private('delete-message').listen(".App\\Events\\DeleteMessageEvent", (data) => {

        if (data.oldData.length <= 1) {

            var currentDate = data.oldData[0].message_date;
            var messageDate = new Date(currentDate);
            var messageDateFormat = formatDate(messageDate);

            var currentDateJquery = new Date();
            var currentDateformat = formatDate(currentDateJquery);

            var yesterday = new Date(currentDateJquery);
            yesterday.setDate(currentDateJquery.getDate() - 1);
            var yesterdayDateformat = formatDate(yesterday);

            if (messageDateFormat == currentDateformat) {
                currentDay = "Today";
            } else if (
                messageDateFormat == yesterdayDateformat
            ) {
                currentDay = "Yesterday";
            } else {
                currentDay = messageDateFormat;
            }

            var dateToShow = $('.dateShow').filter(function () {
                return $(this).find('.dateShowInnerDiv p').text() === currentDay;
            });

            dateToShow.remove();
        }

        var deletemessageId = 'message_' + data.messageId.id;
        var deleteIconElement = $('#' + deletemessageId);
        var nextSibling = deleteIconElement.next();
        nextSibling.remove();
        deleteIconElement.remove();

        if (!(sender_id == data.messageId.sender_id &&
            receiver_id == data.messageId.receiver_id)) {
            var storedUnseenMessages = JSON.parse(localStorage.getItem('unseenMessages'));

            if (storedUnseenMessages !== null) {

                for (var i = 0; i < storedUnseenMessages.length; i++) {
                    if (data.messageId.sender_id == storedUnseenMessages[i].sender_id && data.messageId.receiver_id == storedUnseenMessages[i].receiver_id) {

                        storedUnseenMessages[i].count--;

                        localStorage.setItem('unseenMessages', JSON.stringify(storedUnseenMessages));

                        updateUnseenMessageUI();
                    }
                }


            }
        }

    });

    //Edit message event
    Echo.private('edit-message-handle').listen(".App\\Events\\EditMessageEvent", (data) => {
        // console.log(data)
        var lielementId = 'message_' + data.message.id
        var lielement = $('#' + lielementId).find('p').text(data.message.message)

        lielement.append('<i class="fas fa-pencil-alt" id="messageEditIcon"></i>')

        var currentTime = data.message.updated_at;
        var getTimeArray = currentTime.split(":");
        var formattedTime = getTimeArray.slice(0, 2).join(":");

        var sentClass = $('#sentTime_' + data.message.id).find('p').text(formattedTime)

    });

});