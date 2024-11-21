<?php

namespace App\Http\Controllers;

use App\Events\CallAcceptedEvent;
use App\Events\CallRejectedEvent;
use App\Events\DeleteMessageEvent;
use App\Events\EditMessageEvent;
use App\Events\MessageHandelEvent;
use App\Events\MessageSeenEvent;
use App\Events\SeenIconUpdateEvent;
use App\Events\VoiceCallRequest;
use App\Models\ChatMessage;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    public function chatView()
    {
        $users = User::whereNotIn('id', [Auth()->user()->id])->get();
        // dd($users);
        $loginUser = User::where('id', [Auth()->user()->id])->first();

        foreach ($users as $user) {

            $onlineUser = User::where('id', $user['id'])->first();
            // Log::info('online check:', ['data' => $onlineUser]);

            if ($onlineUser) {
                $onlineUser->update([
                    'is_active' => 'no',
                ]);
            }
        }

        return view('chat-app-view.pages.index', ['users' => $users, 'loginUser' => $loginUser]);
    }

    public function loginUser()
    {
        try {

            $users = User::whereNotIn('id', [Auth()->user()->id])->get();

            $loginUser = User::where('id', [Auth()->user()->id])->first();

            foreach ($users as $user) {

                $onlineUser = User::where('id', $user['id'])->first();
                // Log::info('online check:', ['data' => $onlineUser]);

                if ($onlineUser) {
                    $onlineUser->update([
                        'is_active' => 'no',
                    ]);
                }
            }

            return response()->json(['success' => true, 'users' => $users, 'loginUser' => $loginUser]);
        } catch (\Exception $e) {
            // Log::error('Error in Save Chat data:', ['exception' => $e]);
            return response()->json(['error' => 'Error Occurred While Check Data', 'message' => $e->getMessage()], 500);
        };
    }

    public function saveChat(Request $request)
    {
        try {

            //Log::info('save chat:', ['data' => $request->all()]);

            $time = Carbon::now();
            $currentTimeDate = Carbon::parse($time)
                ->setTimezone('Asia/Kolkata')
                ->toDateTimeString();

            $array = explode(" ", $currentTimeDate);

            $currentDate = $array[0];
            $currentTime = $array[1];
            // var_dump($request->sender_id);

            $images = [];
            $chatArray = [];

            if ($request->hasFile('image')) {
                if ($request->file('image') instanceof UploadedFile) {
                    $image = $request->file('image');
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move(public_path('chat-app/messageImage'), $imageName);
                    $imageUrl = 'messageImage/' . $imageName;
                    $images[] = $imageUrl;
                } else {

                    foreach ($request->file('image') as $image) {
                        $imageName = time() . '_' . $image->getClientOriginalName();
                        $image->move(public_path('chat-app/messageImage'), $imageName);
                        $imageUrl = 'messageImage/' . $imageName;
                        $images[] = $imageUrl;
                    }
                }
                $message = null;
            } else {
                $message = $request->message;
                $imageUrl = null;
            }

            $user = User::where('id', $request->receiver_id)->first();

            if ($user) {
                $status = $user->is_active;
            }

            if ($status == 'yes') {
                $messageStatus = 1;
            } else {
                $messageStatus = 0;
            }

            if ($images) {
                foreach ($images as $imageUrl) {
                    $chat = ChatMessage::create([
                        'sender_id' => $request->sender_id,
                        'receiver_id' => $request->receiver_id,
                        'message' => $message,
                        'image' => $imageUrl,
                        'receiver_status' => $messageStatus,
                        'message_date' => $currentDate,
                        'message_time' => $currentTime,
                        'seen_at' => null,
                        'updated_at' => null,
                    ]);

                    $chatArray[] = $chat;
                }
            } else {
                $chat = ChatMessage::create([
                    'sender_id' => $request->sender_id,
                    'receiver_id' => $request->receiver_id,
                    'message' => $message,
                    'image' => $imageUrl,
                    'receiver_status' => $messageStatus,
                    'message_date' => $currentDate,
                    'message_time' => $currentTime,
                    'seen_at' => null,
                    'updated_at' => null,
                ]);

                $chatArray[] = $chat;
            }

            $user = User::find($chatArray[0]->sender_id);
            $todayDate = date("Y-m-d");

            $oldData = ChatMessage::where(function ($query) use ($request) {
                $query->where('sender_id', '=', $request->sender_id)
                    ->orWhere('sender_id', '=', $request->receiver_id);
            })->where(function ($query) use ($request) {
                $query->where('receiver_id', '=', $request->sender_id)
                    ->orWhere('receiver_id', '=', $request->receiver_id);
            })->where('message_date', $todayDate)
                ->get();

            event(new MessageHandelEvent($chatArray, $user, $oldData));

            $unseenMessage = ChatMessage::where('receiver_id', $request->receiver_id)
                ->whereNull('seen_at')
                ->get();
            //Log::info('save chat:', ['data' => $unseenMessage]);
            event(new MessageSeenEvent($unseenMessage));

            return response()->json(['success' => true, 'oldData' => $oldData, 'data' => $chatArray, 'user' => $user]);
        } catch (\Exception $e) {
            // Log::error('Error in Save Chat data:', ['exception' => $e]);
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
            })->orderBy('message_date', 'ASC')
                ->get();

            $unseenMessage = ChatMessage::where(function ($query) use ($request) {
                $query->where('sender_id', '=', $request->sender_id)
                    ->orWhere('sender_id', '=', $request->receiver_id);
            })->where(function ($query) use ($request) {
                $query->where('receiver_id', '=', $request->sender_id)
                    ->orWhere('receiver_id', '=', $request->receiver_id);
            })->whereNull('seen_at')
                ->get();

            $senderImage = User::where('id', $request->sender_id)->first();
            $receiverImage = User::where('id', $request->receiver_id)->first();

            return response()->json(['success' => true, 'data' => $data, 'senderImage' => $senderImage, 'receiverImage' => $receiverImage, 'unseenMessage' => $unseenMessage]);
        } catch (\Exception $e) {
            Log::error('Error in Check Login:', ['exception' => $e]);
            return response()->json(['error' => 'Error Occurred While get old chat', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateUnseen(Request $request)
    {
        try {
            // Log::info('Chat Data:', ['data' => $request->message]);

            $messages = json_decode($request->message, true);

            if ($messages !== null) {

                // Check if $request->message is an array
                if (is_array($messages)) {
                    // var_dump('sa');
                    if ($request->key == 'click') {
                        // var_dump('2');
                        // $messagesAtIndex0 = array($messages);
                        foreach ($messages as $key => $message) {
                            // var_dump('3');
                            if (isset($message['id'])) {
                                // var_dump('4');
                                $seenMessage = $this->updateMessageSeen($message);
                            }
                        }
                    } else {
                        $messagesAtIndex0 = array($messages);
                        foreach ($messagesAtIndex0 as $key => $message) {

                            if (isset($message['id'])) {
                                $seenMessage = $this->updateMessageSeen($message);
                            }
                        }
                    }
                } else {
                    $this->updateMessageSeen($messages);
                }
            }

            return response()->json(['success' => true, 'message' => 'successfully update', 'seenMessage' => $seenMessage]);
        } catch (\Exception $e) {
            Log::error('Error in get Old chat:', ['exception' => $e]);
            return response()->json(['error' => 'Error Occurred While get old chat', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateMessageSeen($message)
    {

        $unseenMessage = ChatMessage::where('id', $message['id'])
            ->whereNull('seen_at')
            ->first();

        if ($unseenMessage) {
            $unseenMessage->seen_at = now();
            $unseenMessage->save();
        }

        $database_senderId = $message['sender_id'];
        $database_receiverId = $message['receiver_id'];

        event(new SeenIconUpdateEvent($database_senderId, $database_receiverId, $unseenMessage));

        return $unseenMessage;
    }

    public function deleteMessage(Request $request)
    {
        try {

            //Log::info('delete message:', ['data' => $request->all()]);
            $deleteMessage = ChatMessage::where('id', $request->id)->first();


            $oldData = ChatMessage::where(function ($query) use ($request) {
                $query->where('sender_id', '=', $request->senderId)
                    ->orWhere('sender_id', '=', $request->receiverId);
            })->where(function ($query) use ($request) {
                $query->where('receiver_id', '=', $request->senderId)
                    ->orWhere('receiver_id', '=', $request->receiverId);
            })->where('message_date', $deleteMessage->message_date)
                ->get();

                //Log::info('oldData:', ['data' => $oldData]);

            event(new DeleteMessageEvent($deleteMessage, $oldData));

            $deleteMessage->delete();

            return response()->json(['success' => true, 'message' => 'successfully deleted', 'deletedMessage' => $deleteMessage]);
        } catch (\Exception $e) {
            Log::error('Error in While deleteMessage:', ['exception' => $e]);
            return response()->json(['error' => 'Error Occurred While deleteMessage', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateMessage(Request $request)
    {
        try {

            $messageInfo = ChatMessage::where('id', $request->editMessageId)->first();
          //  Log::info('update:', ['data' => $request->all()]);
            $time = Carbon::now();
            $currentTimeDate = Carbon::parse($time)
                ->setTimezone('Asia/Kolkata')
                ->toDateTimeString();

            $array = explode(" ", $currentTimeDate);

            $currentTime = $array[1];

            $messageInfo->update([
                'message' => $request->message,
                'updated_at' => $currentTime,
            ]);

            event(new EditMessageEvent($messageInfo));

            return response()->json(['success' => true, 'message' => 'successfully update', 'updateMessage' => $messageInfo]);
        } catch (\Exception $e) {
            Log::error('Error in While updateing message:', ['exception' => $e]);
            return response()->json(['error' => 'Error Occurred While updateing message', 'message' => $e->getMessage()], 500);
        }
    }

    public function offlineCheck(Request $request)
    {
        try {
            //Log::info('Received user ID:', ['id' => $request->id]);

            $user = User::where('id', $request->id)->first();
            //Log::info('offline check:', ['data' => $user]);


            if ($user) {

                $user->is_active = 'no';
                $user->save();
            }

            return response()->json(['success' => true, 'message' => 'successfully remove working']);
        } catch (\Exception $e) {
            Log::error('Error in While offline checking:', ['exception' => $e]);
            return response()->json(['error' => 'Error Occurred While offline checking', 'message' => $e->getMessage()], 500);
        }
    }

    public function onlineCheck(Request $request)
    {
        try {

            foreach ($request->user as $user) {

                $onlineUser = User::where('id', $user['id'])->first();
                //Log::info('online check:', ['data' => $onlineUser]);

                if ($onlineUser) {
                    $onlineUser->update([
                        'is_active' => 'yes',
                    ]);
                }
            }

            return response()->json(['success' => true, 'message' => 'successfully working']);
        } catch (\Exception $e) {
            Log::error('Error in While online checking:', ['exception' => $e]);
            return response()->json(['error' => 'Error Occurred While online checking', 'message' => $e->getMessage()], 500);
        }
    }

    public function getUserById(Request $request, $id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            return response()->json(['success' => true, 'user' => $user], 200);
        } catch (\Exception $e) {
            Log::error('Error in While getting user by id:', ['exception' => $e]);
            return response()->json(['error' => 'Error in While getting user by id', 'message' => $e->getMessage()], 500);
        }
    }

    public function iconChange(Request $request)
    {
        try {

            $messages = ChatMessage::where('receiver_id', $request->id)->whereNull('seen_at')->get();

            foreach ($messages as $message) {
                $message->update([
                    'receiver_status' => 1,
                ]);
            }
            event(new MessageSeenEvent($messages));
            return response()->json(['success' => true, 'messages' =>  $messages]);
        } catch (\Exception $e) {
            Log::error('Error in While icon change:', ['exception' => $e]);
            return response()->json(['error' => 'Error Occurred While icon change', 'message' => $e->getMessage()], 500);
        }
    }

    public function initiateCall(Request $request)
    {
        //Log::info('initiateCall:', ['data' => $request->all()]);
        $validated = $request->validate([
            'from_user_id' => 'required',
            'to_user_id' => 'required',
        ]);

        $user = User::find($validated['from_user_id']);

        broadcast(new VoiceCallRequest($validated['from_user_id'], $validated['to_user_id'], $user));

        return response()->json(['message' => 'Call initiated']);
    }

    public function acceptCall(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from_user_id' => 'required|exists:users,id',
            'to_user_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = User::find($request->from_user_id);

        // Broadcast call acceptance to caller
        broadcast(new CallAcceptedEvent([
            'fromUserId' => $request->from_user_id,
            'toUserId' => $request->to_user_id,
            'fromUser' => $user
        ]))->toOthers();

        return response()->json(['message' => 'Call accepted'], 200);
    }

    public function rejectCall(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from_user_id' => 'required|exists:users,id',
            'to_user_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Broadcast call rejection to caller
        broadcast(new CallRejectedEvent([
            'fromUserId' => $request->from_user_id,
            'toUserId' => $request->to_user_id
        ]))->toOthers();

        return response()->json(['message' => 'Call rejected'], 200);
    }
}
