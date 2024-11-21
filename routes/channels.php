<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('status-check', function($user){
    return $user;
});

Broadcast::channel('message-handel', function($user){
    // Log::info('Chat Data:', ['data' => $user]);
    return $user;
});

Broadcast::channel('message-seen', function($user){
    return $user;
});

Broadcast::channel('icon-update', function($user){
    return $user;
});

Broadcast::channel('delete-message', function($user){
    return $user;
});

Broadcast::channel('edit-message-handle', function($user){
    return $user;
});

Broadcast::channel('voice-call.{userId}', function ($user, $userId) {
    return (int) $user->id == (int) $userId;
});