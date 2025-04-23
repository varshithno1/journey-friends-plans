
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TripController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\ProfileController;

Route::middleware(['auth:sanctum'])->group(function () {
    // User profile routes
    Route::get('/user', [ProfileController::class, 'show']);
    Route::patch('/user', [ProfileController::class, 'update']);

    // Trip routes
    Route::apiResource('trips', TripController::class);
    
    // Activity routes (nested under trips)
    Route::post('/trips/{trip}/activities', [ActivityController::class, 'store']);
    Route::patch('/trips/{trip}/activities/{activity}', [ActivityController::class, 'update']);
    Route::delete('/trips/{trip}/activities/{activity}', [ActivityController::class, 'destroy']);
});
