<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {

            $errors = $validator->errors()->toArray();

            $flattened_errors = array_merge(...array_values($errors));

            $reindexed_errors = array_values($flattened_errors);

            return response()->json([
                'errors' => $reindexed_errors[0]
            ], 400);
        }

        try {

            $imageName = '';

            if ($request->hasFile('image')) {
                $imageName = time() . '.' . $request->image->extension();
                $request->image->move(public_path('chat-app/image'), $imageName);
                $imageName = 'image/' . $imageName;
            } else {
                $imageName = 'image/default-image.jpg';
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'image' => $imageName,
                'password' => Hash::make($request->password),
            ]);

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'token' => $token,
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong. Please try again later.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);


            if ($validator->fails()) {

                $errors = $validator->errors()->toArray();

                $flattened_errors = array_merge(...array_values($errors));

                $reindexed_errors = array_values($flattened_errors);

                return response()->json([
                    'errors' => $reindexed_errors[0]
                ], 400);
            }

            $credentials = $request->only('email', 'password');

            if ($token = JWTAuth::attempt($credentials)) {
                $user = JWTAuth::user();
                return response()->json([
                    'token' => $token,
                    'user' => $user,
                ], 200);
            }

            return response()->json(['error' => 'Invalid email or password'], 400);
        } catch (\Exception $e) {

            Log::error('Login Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Something went wrong. Please try again later.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function user(Request $request)
    {
        return response()->json(auth()->user());
    }

    public function logout(Request $request)
    {
        //Log::info('Logout called');
        try {

            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {

            Log::error('Logout failed: ' . $e->getMessage());
            return response()->json(['error' => 'Logout failed'], 500);
        }
    }

    public function authenticate(Request $request)
    {
        //Log::info('Logout called');
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token not valid'], 401);
        }

        return Broadcast::auth($request);
    }
}
