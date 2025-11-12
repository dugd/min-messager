<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MessageController;
use \App\Http\Controllers\ConversationController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [UserController::class, 'me']);
    Route::get('users/me', [UserController::class, 'me']);
    Route::patch('/users/me', [UserController::class, 'update']);
    Route::get('/users/profiles/{user:username}', [UserController::class, 'show']);
    Route::get('/users/search', [UserController::class, 'search']);

    Route::post('/messages', [MessageController::class, 'direct']);
    Route::get('/conversations/{conversation}/messages', [MessageController::class, 'messages']);
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'group']);
    Route::put('/messages/{message}', [MessageController::class, 'update']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);

    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
});
