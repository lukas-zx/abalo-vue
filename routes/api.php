<?php

use App\Http\Controllers\AbArticleController;
use App\Http\Controllers\AbShoppingcartController;
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

Route::get('/article', [AbArticleController::class, 'search_api']);
Route::post('/article', [AbArticleController::class, 'addArticle_api']);
Route::post('/article/{id}/sold', [AbArticleController::class, 'soldArticle_api']);

Route::post('/shoppingcart', [AbShoppingcartController::class, 'addItem_api']);
Route::delete('/shoppingcart/{shoppingcartid}/articles/{articleid}', [AbShoppingcartController::class, 'deleteItem_api']);
Route::get('/shoppingcart', [AbShoppingcartController::class, 'getItems_api']);
