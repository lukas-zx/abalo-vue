<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbUser extends Model
{
    protected $table = 'ab_user';
    protected $primaryKey = 'id';
    public $timestamps = 'false';
}
