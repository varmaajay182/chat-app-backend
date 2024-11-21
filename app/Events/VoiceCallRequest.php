<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class VoiceCallRequest implements ShouldBroadcast
{
    use SerializesModels;

    public $fromUserId;
    public $toUserId;
    public $user;

    public function __construct($fromUserId, $toUserId, $user)
    {
        $this->fromUserId = $fromUserId;
        $this->toUserId = $toUserId;
        $this->user = $user;

    }

    public function broadcastOn()
    {
        return new Channel('voice-call.' . $this->toUserId);
    }

    public function broadcastWith()
    {
        return [
            'fromUserId' => $this->fromUserId,
            'fromUser' => $this->user
        ];
    }
}
