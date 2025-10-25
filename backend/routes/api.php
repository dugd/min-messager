<?php

use App\Http\Controllers\AuthController;    
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::get('/me', fn (\Illuminate\Http\Request $r) => $r->user())
    ->middleware('auth:sanctum');
