<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use function Webmozart\Assert\Tests\StaticAnalysis\integer;
use function Webmozart\Assert\Tests\StaticAnalysis\length;

class DevelopmentData extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = fopen(resource_path('/user.csv'), 'r');
        if (!$file) {
            die("error");
        }

        $user = array(
            'id' => 0,
            'ab_name' => 'test',
            'ab_password' => 'test',
            'ab_mail' => 'test'
        );
        $users = [];

        // remove header
        $firstline = fgetcsv($file, 1000, ';');

        while(($line = fgetcsv($file, 1000, ';')) !== false) {
            $felder = count($line);
            $user['id'] = $line[0];
            $user['ab_name'] = $line[1];
            $user['ab_password'] = $line[2];
            $user['ab_mail'] = $line[3];
            $users[] = $user;
        }
        fclose($file);

        foreach ($users as $user) {
            DB::table('ab_user')
                ->insert([
                    //'id' => $user['id'],
                    'ab_name' => $user['ab_name'],
                    'ab_password' => $user['ab_password'],
                    'ab_mail' => $user['ab_mail']
                ]);
        }

        $file = fopen(resource_path('/articles.csv'), 'r');
        if (!$file) {
            die("error");
        }

        $article = array(
            'id' => 0,
            'ab_name' => 'test',
            'ab_price' => 'test',
            'ab_description' => 'test',
            'ab_creator_id' => 'test',
            'ab_createdate' => 'test'
        );
        $articles = [];

        // remove header
        $firstline = fgetcsv($file, 1000, ';');

        while(($line = fgetcsv($file, 1000, ';')) !== false) {
            $felder = count($line);
            $article['id'] = $line[0];
            $article['ab_name'] = $line[1];
            $article['ab_price'] = (int)$line[2];
            $article['ab_description'] = $line[3];
            $article['ab_creator_id'] = $line[4];
            $article['ab_createdate'] = $line[5];
            $articles[] = $article;
        }
        fclose($file);

        foreach ($articles as $article) {
            DB::table('ab_article')
                ->insert([
                    //'id' => $article['id'],
                    'ab_name' => $article['ab_name'],
                    'ab_price' => $article['ab_price'],
                    'ab_description' => $article['ab_description'],
                    'ab_creator_id' => $article['ab_creator_id'],
                    'ab_createdate' => $article['ab_createdate']
                ]);
        }

        $file = fopen(resource_path('/articlecategory.csv'), 'r');
        if (!$file) {
            die("error");
        }

        $category = array(
            'id' => 0,
            'ab_name' => 'test',
            'ab_description' => null,
            'ab_parent' => null,
        );
        $categories = [];

        // remove header
        $firstline = fgetcsv($file, 1000, ';');

        while(($line = fgetcsv($file, 1000, ';')) !== false) {
            $felder = count($line);
            $category['id'] = $line[0];
            $category['ab_name'] = $line[1];
            $category['ab_parent'] = $line[2];
            if ($category['ab_parent'] === 'NULL') {
                $category['ab_parent'] = NULL;
            }
            $categories[] = $category;
        }
        fclose($file);

        foreach ($categories as $category) {
            DB::table('ab_articlecategory')
                ->insert([
                    //'id' => $category['id'],
                    'ab_name' => $category['ab_name'],
                    'ab_parent' => $category['ab_parent'],
                ]);
        }

        $file = fopen(resource_path('/article_has_articlecategory.csv'), 'r');
        if (!$file) {
            die("error");
        }

        $article_has_articlecategory = array(
            'ab_articlecategory_id' => 0,
            'ab_article_id' => 0
        );
        $articles_have_articlecategories = [];

        // remove header
        $firstline = fgetcsv($file, 1000, ';');

        while(($line = fgetcsv($file, 1000, ';')) !== false) {
            $felder = count($line);
            $article_has_articlecategory['ab_articlecategory_id'] = $line[0];
            $article_has_articlecategory['ab_article_id'] = $line[1];
            $articles_have_articlecategories[] = $article_has_articlecategory;
        }
        fclose($file);

        foreach ($articles_have_articlecategories as $article_has_articlecategory) {
            DB::table('ab_article_has_articlecategory')
                ->insert([
                    'ab_articlecategory_id' => $article_has_articlecategory['ab_articlecategory_id'],
                    'ab_article_id' => $article_has_articlecategory['ab_article_id'],
                ]);
        }

    }
}
