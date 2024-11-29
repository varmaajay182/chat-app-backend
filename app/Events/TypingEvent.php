<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TypingEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $senderId;
    public $receiverId;
    public $isTyping;

    /**
     * Create a new event instance.
     */
    public function __construct($senderId, $receiverId, $isTyping = true)
    {
        $this->senderId = $senderId;
        $this->receiverId = $receiverId;
        $this->isTyping = $isTyping;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new PrivateChannel('typing.' . $this->receiverId);
    }

    public function broadcastWith()
    {
        return [
            'senderId' => $this->senderId,
            'receiverId' => $this->receiverId,
            'isTyping' => $this->isTyping
        ];
    }
}
