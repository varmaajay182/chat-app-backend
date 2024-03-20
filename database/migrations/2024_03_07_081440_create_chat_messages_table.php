<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id'); 
            $table->foreign('sender_id')->references('id')->on('users');
            $table->unsignedBigInteger('receiver_id'); 
            $table->foreign('receiver_id')->references('id')->on('users');
            $table->text('message');
            $table->date('message_date'); 
            $table->time('message_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};
