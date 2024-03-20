<?php

namespace App\Http\Controllers;

use App\Events\MessageHandelEvent;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ChatController extends Controller
{
    public function chatView()
    {
        $users = User::whereNotIn('id', [Auth()->user()->id])->get();
        $loginUser = User::where('id', [Auth()->user()->id])->first();
        return view('chat-app-view.pages.index', ['users' => $users, 'loginUser' => $loginUser]);
    }

    public function saveChat(Request $request)
    {
        try {
            $time = Carbon::now();
            $currentTimeDate = Carbon::parse($time )
            ->setTimezone('Asia/Kolkata')
            ->toDateTimeString();
              
            $array = explode(" ", $currentTimeDate);

            $currentDate = $array[0];
            $currentTime = $array[1];
        
            // Log::info('Chat Data:', ['data' => $currentTimeDate]);
            $chat = ChatMessage::create([
                'sender_id' => $request->sender_id,
                'receiver_id' => $request->receiver_id,
                'message' => $request->message,
                'message_date'=>$currentDate,
                'message_time'=>$currentTime
            ]);

            $user = User::find($chat->sender_id);

            $oldData = ChatMessage::where(function ($query) use ($request) {
                $query->where('sender_id', '=', $request->sender_id)
                    ->orWhere('sender_id', '=', $request->receiver_id);
            })->where(function ($query) use ($request) {
                $query->where('receiver_id', '=', $request->sender_id)
                    ->orWhere('receiver_id', '=', $request->receiver_id);
            })->get();

            event(new MessageHandelEvent($chat, $user));

            return response()->json(['success' => true,'oldData'=>$oldData, 'data' => $chat, 'user' => $user]);
        } catch (\Exception $e) {
            Log::error('Error in Check Login:', ['exception' => $e]);
            return response()->json(['error' => 'Error Occurred While Check Data', 'message' => $e->getMessage()], 500);
        }
    }

    public function loadOldChat(Request $request)
    {
        try {

            $data = ChatMessage::where(function ($query) use ($request) {
                $query->where('sender_id', '=', $request->sender_id)
                    ->orWhere('sender_id', '=', $request->receiver_id);
            })->where(function ($query) use ($request) {
                $query->where('receiver_id', '=', $request->sender_id)
                    ->orWhere('receiver_id', '=', $request->receiver_id);
            })->get();
            
            $senderImage = User::where('id',$request->sender_id)->first();
            $receiverImage = User::where('id', $request->receiver_id)->first();

            return response()->json(['success' => true, 'data' => $data, 'senderImage'=>$senderImage, 'receiverImage'=>$receiverImage]);
        } catch (\Exception $e) {
            Log::error('Error in Check Login:', ['exception' => $e]);
            return response()->json(['error' => 'Error Occurred While get old chat', 'message' => $e->getMessage()], 500);
        }
    }
}
