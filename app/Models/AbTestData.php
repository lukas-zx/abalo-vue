<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbTestData extends Model
{
    protected $table = 'ab_testdata';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
}
