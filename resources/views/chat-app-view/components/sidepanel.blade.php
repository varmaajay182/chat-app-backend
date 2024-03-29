<div id="sidepanel">
    <div id="profile">
        <div class="wrap">
            <div class="btn-group">
                <img id="profile-img" src="{{ asset('chat-app/' . $loginUser->image) }}" class="online dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="#">Profile</a>
                    <a class="dropdown-item" href="#">Change Password</a>
                    <div class="dropdown-divider"></div>
                    <form method="POST" action="{{ route('logout') }}" class="d-flex align-items-center">
                        @csrf
                       
                            {{-- <i class="fa fa-sign-out" aria-hidden="true"></i> --}}
                            <button type="submit" class="dropdown-item" href="">Log Out</button>
                       
                      
                    </form>
                   
                </div>
            </div>

            <p>{{ $loginUser->name }}</p>


        </div>
    </div>
    {{-- {{isset($unseenMessage)}}
    {{dd(count($unseenMessage))}} --}}
    <div class="container">
        <div class="sidepanel-content">
            <div id="search">
                <div class="search-content">
                    <label for=""><i class="fa fa-search" aria-hidden="true"></i></label>
                    <input type="text" placeholder="Search contacts..." />
                </div>
            </div>
            <div id="contacts">
                <ul>
                    @foreach ($users as $user)
                        {{-- {{var_dump($user)}} --}}
                        <li class="contact" data-id="{{ $user->id }}" id="user_{{ $user->id }}">
                            <div class="wrap">
                                <span class="contact-status status-offline" id="status-{{ $user->id }}"></span>
                                <img src="{{ asset('chat-app/' . $user->image) }}" alt="" />
                                <div class="meta">
                                    <div>
                                        <p class="name">{{ $user->name }}</p>
                                        @if ($user->is_active == 'no')
                                            <p class="preview" id="preview-{{ $user->id }}">offline</p>
                                        @else
                                            <p class="preview" id="preview-{{ $user->id }}"></p>
                                        @endif
                                    </div>

                                    <div class="unseenNumber">

                                        <p></p>
                                    </div>

                                </div>
                            </div>
                        </li>
                    @endforeach
                    {{-- {{dd('sd')}} --}}


                </ul>
            </div>

        </div>
    </div>

    {{-- <div id="bottom-bar">
        <button id="addcontact"><i class="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add
                contact</span></button>
        <button id="settings" class="d-flex">
           
            <span>Logout</span>
        </button>
    </div> --}}

</div>
