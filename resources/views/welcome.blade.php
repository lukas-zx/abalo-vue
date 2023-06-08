<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Abalo</title>
</head>
<body>
    <div id="app">
        <site-header :navelements="navElements"></site-header>
        <site-body :showimpressum="showImpressum"></site-body>
        <site-footer @toggle-impressum="toggleImpressum"></site-footer>
    </div>
    @vite('resources/js/app.js')
    @vite('resources/css/app.css')
</body>
</html>
