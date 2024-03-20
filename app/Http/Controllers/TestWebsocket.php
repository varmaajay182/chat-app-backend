<?php

namespace App\Http\Controllers;

use App\Events\testWebsocket as EventsTestWebsocket;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TestWebsocket extends Controller
{
    public function test()
    {
        $data = 'tested chat';
        event(new EventsTestWebsocket($data));
        return view('testingWebsocket');
    }

    public function check()
    {
        $data = 'tested chat';
        event(new EventsTestWebsocket($data));
        return view('testingWebsocket');
    }

    public function chatView()
    {
        $users = User::whereNotIn('id', [Auth()->user()->id])->get();
        $loginUser = User::where('id',[Auth()->user()->id])->first();
        return view('chat-app-view.pages.index', ['users'=>$users,'loginUser'=>$loginUser]);
    }
}
