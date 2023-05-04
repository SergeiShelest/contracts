<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\JWTController;
use App\Http\Middleware\JWTMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/auth/signup', [JWTController::class, 'signup']);
Route::post('/auth/login', [JWTController::class, 'login']);
Route::get('/auth/accept-email/{key}', [JWTController::class, 'acceptEmail']);

Route::resource('/contract', ContractController::class)->middleware(JWTMiddleware::class);
