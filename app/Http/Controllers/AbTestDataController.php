<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AbTestData;
use Illuminate\Http\Request;

class AbTestDataController extends Controller
{

    public function getTestdata() {
        $testdata = AbTestData::select('id', 'ab_testname')
            ->orderBy('id', 'asc')
            ->get();

        $data = [
            'ab_testdata' => $testdata
        ];

        return view('ab_testdata', $data);
    }
}
