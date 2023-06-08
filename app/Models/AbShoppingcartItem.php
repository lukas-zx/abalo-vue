<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbShoppingcartItem extends Model
{
    protected $table = 'ab_shoppingcart_item';
    protected $primaryKey = 'id';
    public $timestamps = 'false';
}
