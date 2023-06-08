<?php

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
Route::view('/', 'welcome');

Route::get('/newsite', [\App\Http\Controllers\AbArticleController::class, 'newsite']);

Route::get('/testdata', [\App\Http\Controllers\AbTestDataController::class, 'getTestdata']);

Route::get('/login', [App\Http\Controllers\AuthController::class, 'login'])->name('login');
Route::get('/logout', [App\Http\Controllers\AuthController::class, 'logout'])->name('logout');
Route::get('/isloggedin', [App\Http\Controllers\AuthController::class, 'isloggedin'])->name('haslogin');

Route::get('/article', [\App\Http\Controllers\AbArticleController::class, 'search']);
Route::post('/article', 'App\Http\Controllers\AbArticleController@add');

Route::get('/newarticle', [\App\Http\Controllers\AbArticleController::class, 'newArticle']);

Route::view('/3-ajax1-static', '3-ajax1-static' );
Route::view('/3-ajax2-periodic', '/3-ajax2-periodic' );
