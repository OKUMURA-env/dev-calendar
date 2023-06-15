<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    public function postEvent(Request $request)
    {
      $event = new Event();
      $event->start = $request->start; 
      $event->title = $request->title;
      $event->color = $request->color;
  
      $event->save();
      return $event;
    }
}
