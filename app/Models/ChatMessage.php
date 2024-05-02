<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
        'image',
        'message_date',
        'message_time',
        'seen_at',
        'receiver_status',
        'updated_at'
    ];
}
