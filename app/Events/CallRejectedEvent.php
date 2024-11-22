<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallRejectedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $callData;

    public function __construct($callData)
    {
        $this->callData = $callData;
    }

    public function broadcastOn(): array
    {

        return [
            new Channel('voice-call-end'),
        ];

        //return new PrivateChannel('voice-call-accept');
    }

   /* public function broadcastWith(): array
    {
        return [
            'toUserId' => $this->callData['toUserId'],
            'status' => 'rejected',
            'message' => 'Call Rejected'
        ];
    } */
}
