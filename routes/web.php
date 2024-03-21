<?php

use App\Events\testWebsocket as EventsTestWebsocket;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TestWebsocket;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //chat
    Route::get('chatApp',[ChatController::class,'chatView']);
    Route::post('/save-chat',[ChatController::class,'saveChat']);
    Route::post('/load-chat',[ChatController::class,'loadOldChat']);
    Route::post('/update-unseenmessage',[ChatController::class,'updateUnseen']);

});

Route::get('test',[TestWebsocket::class,'test']);
Route::get('check',[TestWebsocket::class,'check']);
require __DIR__.'/auth.php';
