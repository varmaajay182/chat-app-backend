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
    <script src="{{ asset('/sw.js') }}"></script>
<script>
if (!navigator.serviceWorker.controller) {
    navigator.serviceWorker.register("/sw.js").then(function (reg) {
        console.log("Service worker has been registered for scope: " + reg.scope);
    });
}
</script>
    @include('chat-app-view.components.footer')
</body>

</html>
