<?php

namespace App\Http\Controllers;

class PageController extends Controller
{
    public function home()       { return view('pages.home'); }
    public function catalog()    { return view('pages.catalog'); }
    public function quiz()       { return view('pages.quiz'); }
    public function challenge()  { return view('pages.challenge'); }
    public function statistik()  { return view('pages.statistik'); }
    public function chatAi()     { return view('pages.chat-ai'); }   
}
