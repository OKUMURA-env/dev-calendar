<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel × FullCalendar</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <!-- Script -->
    <script src="{{ asset('js/app.js') }}"></script>
</head>

<body>
    <div id="app">
        <div class="m-auto w-50 m-5 p-5">
            <div id='calendar2'></div>
        </div>
    </div>

    <link href='{{ asset('fullcalendar-6.1.7/lib/main.css') }}' rel='stylesheet' />
    <script src='{{ asset('fullcalendar-6.1.7/lib/main.js') }}'></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var calendarEl = document.getElementById('calendar2');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'ja',
                height: 'auto',
                firstDay: 1,
                headerToolbar: {
                    left: "today prev,next",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,listMonth"
                },
                buttonText: {
                    today: '今日',
                    week: '週',
                    month: '月',
                    list: '一覧'
                },
                noEventsContent: 'スケジュールはありません',

                // 日付をクリック、または範囲を選択したイベント
                selectable: true,
                select: function(info) {
                    // 入力ダイアログ
                    const eventName = prompt("イベントを入力してください");

                    if (eventName) {
                        // イベントの追加
                        calendar.addEvent({
                            title: eventName,
                            start: info.start,
                            end: info.end,
                            allDay: true,
                        });
                    }
                },
            });
            calendar.render();
        });
    </script>
</body>

</html>