<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::get('/article', [\App\Http\Controllers\AbArticleController::class, 'search_api']);
Route::post('/article', [\App\Http\Controllers\AbArticleController::class, 'addArticle_api']);

Route::post('/shoppingcart', [\App\Http\Controllers\AbShoppingcartController::class, 'addItem_api']);
Route::delete('/shoppingcart/{shoppingcartid}/articles/{articleid}', [\App\Http\Controllers\AbShoppingcartController::class, 'deleteItem_api']);
Route::get('/shoppingcart', [\App\Http\Controllers\AbShoppingcartController::class, 'getItems_api']);
