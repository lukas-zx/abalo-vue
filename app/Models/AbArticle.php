<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static select()
 */
class AbArticle extends Model
{
    protected $table = 'ab_article';
    protected $primaryKey = 'id';
    public $timestamps = 'false';
}
