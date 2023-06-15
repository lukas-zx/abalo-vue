<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * Write static login information to the session.
 * Use for test purposes.
 */
class AuthController extends Controller
{
    public function login(Request $request) {
        $request->session()->put('abalo_id', 6);
        $request->session()->put('abalo_user', 'seller');
        $request->session()->put('abalo_mail', 'seller@abalo.example.com');
        $request->session()->put('abalo_time', time());
        return redirect()->route('haslogin');
    }

    public function logout(Request $request) {
        $request->session()->flush();
        return redirect()->route('haslogin');
    }


    public function isLoggedIn(Request $request) {
        if($request->session()->has('abalo_user')) {
            $r["id"] = $request->session()->get('abalo_id');
            $r["user"] = $request->session()->get('abalo_user');
            $r["time"] = $request->session()->get('abalo_time');
            $r["mail"] = $request->session()->get('abalo_mail');
            $r["auth"] = "true";
        }
        else $r["auth"]="false";
        return response()->json($r);
    }
}
