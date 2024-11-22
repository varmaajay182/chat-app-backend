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

    /**
     * Create a new event instance.
     */

    public $callData;

    public function __construct($callData)
    {
        $this->callData = $callData;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */

    public function broadcastOn(): array
    {

        return [
            new Channel('voice-call-accept'),
        ];

        //return new PrivateChannel('voice-call-accept');
    }

    /* public function broadcastWith()
    {
        return [
            'toUserId' => $this->callData['toUserId'],
            'status' => 'accepted',
            'message' => 'Call Accepted'
        ];
    } */
}
