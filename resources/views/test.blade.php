<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <div style="margin-top:30px; border:1px solid gray;">
        <form id="form" action="">
            <p><input type="text" name="title" placeholder="タイトル入力"></p>
            <p>開始日<input type="date" name="start" placeholder="日付入力"></p>
            <p>終了日<input type="date" name="end" placeholder="日付入力"></p>
            <p><input type="color" name="color"></p>
        </form>

        <button id="bt2">
            Ajax->DBにPostテスト
        </button>


        <script>
            $("#bt2").click(function() { // bt2のidの要素をクリックしたときに発動
                $.ajaxSetup({
                    headers: {
                        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
                    },
                });
                var formData = $("#form").serialize();
                console.log(formData);

                $.ajax({
                        //POST通信
                        type: "post", //HTTP通信のメソッドをPOSTで指定
                        //ここでデータの送信先URLを指定します。
                        url: "/postevent", //通信先のURL
                        dataType: "json", // データタイプをjsonで指定
                        data: formData, // serializeしたデータを指定
                    })
                    //通信が成功したとき
                    .then((res) => {
                        console.log(res);
                        // カレンダーの再描画
                        var calendarEl = document.getElementById("calendar");
                        var calendar = new FullCalendar.Calendar(calendarEl, {
                            headerToolbar: {
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                            },
                            locale: "ja",
                            editable: true,
                            googleCalendarApiKey: "GoogleのAPIKEY",
                            eventSources: [{
                                googleCalendarId: "japanese__ja@holiday.calendar.google.com", //祝日の予定を取得
                                rendering: "background",
                                color: "#FF6666",
                            }, ],
                            events: "/getevents",
                            selectable: true,
                        });
                        calendar.render(); //カレンダーを再描画
                    })
                    //通信が失敗したとき
                    .fail((error) => {
                        console.log(error.statusText);
                    });

            });
        </script>
</body>

</html>