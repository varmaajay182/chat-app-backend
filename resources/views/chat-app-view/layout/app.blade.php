<!DOCTYPE html>
<html class=''>

<head>

    @include('chat-app-view.components.header')
</head>

<body>
    <div class="uperDiv"></div>
 
    <div id="frame">
       @include('chat-app-view.components.sidepanel')
        @yield('content')
    </div>
    @include('chat-app-view.components.footer')
</body>

</html>
