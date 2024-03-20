@extends('chat-app-view.layout.app')
@section('content')
    <div class="startChat">
        <div class="box">
            <div class="image">
                <img src="{{ asset('chat-app/chatImage/chatimage.png') }}" alt="">
            </div>
        </div>
    </div>

    <div class="content">
        <div class="contact-profile">

        </div>
        <div class="messages">
            <div class="dateShow">
                <div class="dateShowInnerDiv">
                    <p></p>
                </div>
            </div>
           
                <li class="sent">
                    <img src="" alt="">
                    <p></p>
                </li>
                <div class="senttime">
                    <p></p>
                </div>
                <li class="replies">

                </li>
                <div class="replytime">
                    <p> </p>
                </div>
         
        </div>
        <div class="message-input">
            <form id="getMessage">
                <div class="element">
                    <div class="plus-icon">
                        <i class="fa-solid fa-plus"></i>
                    </div>
                    <input type="text" class="form-control" placeholder="Type your message...">
                    <button class="iButton" type="submit"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </form>
        </div>
    </div>
@endsection
