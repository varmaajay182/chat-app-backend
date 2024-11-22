<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
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

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('voice-call.' . $this->toUserId);
    }

    public function broadcastWith(): array
    {
        return [
            'fromUserId' => $this->fromUserId,
            'fromUser' => $this->user
        ];
    }
}
