<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    /**
     * カレンダーを表示
     *
     * @param  Request  $request
     */
     public function calendar(Request $request)
     {
         return view('calendar');
     }

    /**
     * イベントを取得・表示
     *
     * @param  Request  $request
     */
    public function scheduleGet(Request $request)
    {    
        $start_date = $request->input('start_date');
        $end_date = $request->input('end_date');

        // 登録処理
        return Schedule::query()
            ->select(
                // FullCalendarの形式に合わせる
                'id',
                'start_date as start',
                'end_date as end',
                'event_name as title'
            )
            // FullCalendarの表示範囲のみ表示
            ->where('end_date', '>', $start_date)
            ->where('start_date', '<', $end_date)
            ->get();
    }

    // "2019-12-12T00:00:00+09:00"のようなデータを今回のDBに合うように"2019-12-12"に整形
    private function formatDate($date)
    {
        return str_replace('T00:00:00+09:00', '', $date);
    }

    /**
     * イベントを登録
     *
     * @param  Request  $request
     */
    public function scheduleAdd(Request $request)
    {
        $event = Schedule::create([
            'event_name' => $request->event_name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        return response()->json($event);

        return redirect('http://localhost/calendar');
    }

    /**
     * イベントを更新
     *
     * @param  Request  $request
     */
    public function scheduleUpdate(Request $request)
    {
        $event = Schedule::where('id',$request->id)->update([
            'event_name' => $request->event_name,
        ]);

        return response()->json($event);

        return redirect('http://localhost/calendar');
    }

    /**
     * イベントを削除
     *
     * @param  Request  $request
     */
    public function scheduleDestroy(Request $request)
    {
        Schedule::find($request->id)->delete();

        return redirect('http://localhost/calendar');
    }

}