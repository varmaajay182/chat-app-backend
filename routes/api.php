<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use Tymon\JWTAuth\Facades\JWTAuth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);

Route::get('/test-token', function (Request $request) {
    try {
        $user = JWTAuth::parseToken()->authenticate();
        return response()->json(['user' => $user]);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 401);
    }
});

Route::post('broadcasting/auth', [AuthController::class, 'authenticate']);
Route::post('/offline-check',[ChatController::class,'offlineCheck']);

Route::middleware(['jwt.auth'])->group(function () {
    Route::get('user', [AuthController::class, 'user']);
    Route::get('login-user', [ChatController::class, 'loginUser']);
    Route::post('/online-check',[ChatController::class,'onlineCheck']);
    Route::get('/get-user/{id}', [ChatController::class, 'getUserById']);
    Route::post('/load-chat',[ChatController::class,'loadOldChat']);
    Route::post('/save-chat',[ChatController::class,'saveChat']);
    Route::post('/icon-change',[ChatController::class,'iconChange']);
    Route::post('/update-unseenmessage',[ChatController::class,'updateUnseen']);
});
