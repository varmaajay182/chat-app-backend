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
        'message_time',
        'receiver_status',
        'message_date',
        'updated_at'
    ];
}
