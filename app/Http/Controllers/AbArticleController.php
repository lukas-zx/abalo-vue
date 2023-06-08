<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use DateTime;
use Illuminate\Http\Request;
use App\Models\AbArticle;
use Illuminate\Support\Facades\DB;
use JetBrains\PhpStorm\NoReturn;
use function Webmozart\Assert\Tests\StaticAnalysis\length;

class AbArticleController extends Controller
{
    function search(Request $request) {
        $article = $request['search'];
        $article = strtolower($article);
        $article = '%' . $article . '%';
        $articles = AbArticle::select()
        ->where('ab_name', 'ilike', $article)
        ->get();

        foreach ($articles as $article) {
            $article['ab_image'] = 'no image';
            $imgpath = public_path() . '\img\\';
            if (file_exists($imgpath . $article['id'] . '.png')) {
                $article['ab_image'] = '/img/' . $article['id'] . '.png';
            }
            if (file_exists($imgpath . $article['id'] . '.jpg')) {
                $article['ab_image'] = '/img/' . $article['id'] . '.jpg';
            }
        }

        $data = [
            'articles' => $articles,
        ];

        return view('articles', $data);
    }

    public function newArticle() {
        return view('newarticle');
    }

    #[NoReturn] public function add(Request $request) {
        $name = $request['name'];
        $price = $request['price'];
        $description = $request['description'];
        $creatorid = 1;
        $createdate = date('Y-m-d H:i:s');
        $errormessage = null;

        if ($name === null) $errormessage = 'Artikel muss einen Namen haben';
        if (strlen($name) > 80) $errormessage = 'Name darf nicht mehr als 80 Zeichen haben';
        if ($price === null) $errormessage = 'Artikel muss einen Preis haben';
        if ($price <= 0) $errormessage = 'Preis muss größer 0 sein';
        if ($description === null) $errormessage = 'Artikel muss eine Beschreibung haben';
        if (strlen($description) > 1000) $errormessage = 'Beschreibung darf nicht mehr als 1000 Zeichen haben';

        if ($errormessage !== null) {
            print_r($errormessage);
        } else {
            if (!DB::table('ab_article')
                ->insert([
                    'ab_name' => $name,
                    'ab_price' => $price,
                    'ab_description' => $description,
                    'ab_creator_id' => $creatorid,
                    'ab_createdate' => $createdate
                ])) print_r('Fehler beim Einfügen in die Datenbank');
        }
    }

    function search_api(Request $request) {
        $article = $request['search'];
        $article = strtolower($article);
        $article = '%' . $article . '%';
        if(strlen($request['search']) < 3){
            $articles = AbArticle::select()
                ->offset($request['offset'])
                ->limit($request['limit'])
                ->get();
        } else {
            $articles = AbArticle::select()
                ->where('ab_name', 'ilike', $article)
                ->offset($request['offset'])
                ->limit($request['limit'])
                ->get();
        }


        foreach ($articles as $article) {
            $article['ab_image'] = 'no image';
            $imgpath = public_path() . '\img\\';
            if (file_exists($imgpath . $article['id'] . '.png')) {
                $article['ab_image'] = '/img/' . $article['id'] . '.png';
            }
            if (file_exists($imgpath . $article['id'] . '.jpg')) {
                $article['ab_image'] = '/img/' . $article['id'] . '.jpg';
            }
        }

        $data = [
            'articles' => $articles,
        ];

        return response()->json($articles);
    }

    function addArticle_api(Request $request) {
        $name = $request['name'];
        $price = $request['price'];
        $description = $request['description'];
        $creatorid = 1;
        $createdate = date('Y-m-d H:i:s');
        $errormessage = null;

        if ($name === null) $errormessage = 'Artikel muss einen Namen haben';
        if (strlen($name) > 80) $errormessage = 'Name darf nicht mehr als 80 Zeichen haben';
        if ($price === null) $errormessage = 'Artikel muss einen Preis haben';
        if ($price <= 0) $errormessage = 'Preis muss größer 0 sein';
        if ($description === null) $errormessage = 'Artikel muss eine Beschreibung haben';
        if (strlen($description) > 1000) $errormessage = 'Beschreibung darf nicht mehr als 1000 Zeichen haben';

        if ($errormessage !== null) {
            return response()->json($errormessage);
        } else {
            DB::table('ab_article')->insert([
                    'ab_name' => $name,
                    'ab_price' => $price,
                    'ab_description' => $description,
                    'ab_creator_id' => $creatorid,
                    'ab_createdate' => $createdate
                ]);
            $id = AbArticle::select('id')
                ->where('ab_name', 'ilike', $name)
                ->get();
            return response()->json($id);
        }
    }

    public function newsite (){
        return view('newsite');
    }
}


