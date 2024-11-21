<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallAcceptedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $callData;

    public function __construct($callData)
    {
        $this->callData = $callData;
    }

    public function broadcastOn()
    {
        return new Channel('voice-call.' . $this->callData['fromUserId']);
    }

    public function broadcastWith()
    {
        return [
            'toUserId' => $this->callData['toUserId'],
            'status' => 'accepted',
            'message' => 'Call Accepted'
        ];
    }
}
