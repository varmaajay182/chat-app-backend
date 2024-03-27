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

        <div class="image-preview">
            <div class="image-preview-outer">
                <div class="image-preview-inner">
                    {{-- <img src="{{asset('chat-app/image/1710852946.webp')}}" alt=""> --}}

                </div>
            </div>
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
                <i class="fa-solid fa-check"></i>
            </div>

        </div>

        <div class="message-input">
            <form id="getMessage" enctype="multipart/form-data">
                @csrf
                <div class="element">
                    <div class="plus-icon">

                        <input accept="*" multiple="" type="file" name="document" id="document-file" style="display: none;">
                        <input accept="image/*,video/mp4,video/3gpp,video/quicktime" id="image-file" multiple=""
                            type="file" name="image[]" style="display: none;">
                        <div class="dropdown mt-3">
                            <i class="fa-solid fa-plus " id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false"></i>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <button class="dropdown-item" type="button" id="dropdown-document">
                                    <i class="fa-solid fa-file-alt dropdown-icon"></i> Document
                                </button>
                                <button class="dropdown-item" type="button" id="dropdown-image">
                                    <i class="fa-solid fa-image dropdown-icon"></i> Image
                                </button>
                            </div>

                        </div>

                    </div>
                    <input type="hidden" id="editMessageId" name="editMessageId">
                    <input type="text" class="form-control" id="chatWrite" placeholder="Type your message..." name="message">
                    <button class="iButton" type="submit"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </form>
        </div>
    </div>
@endsection
