import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import axios from "axios";

axios.defaults.headers.common = {
    "X-Requested-With": "XMLHttpRequest",
    "X-CSRF-TOKEN": document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content"),
};

document.addEventListener('DOMContentLoaded', function() {

var calendarEl = document.getElementById("calendar");

let calendar = new Calendar(calendarEl, {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",

    events: "http://localhost/calendar",
    locale: "ja",
    height: "auto",
    firstDay: 1,
    headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listMonth",
    },
    buttonText: {
        today: "今日",
        week: "週",
        month: "月",
        list: "一覧",
    },


    noEventsContent: "スケジュールはありません",

    // 日付をクリック、または範囲を選択したイベント
    selectable: true,
    select: function (selectInfo) {
        let title = prompt("イベントを入力してください");

        // console.log(selectInfo);
        if (title) {
            axios
                .post("http://localhost/schedule-add", {
                    start_date: selectInfo.startStr.valueOf(),
                    end_date: selectInfo.endStr.valueOf(),
                    event_name: title,
                })
                .then(() => {
                    calendar.refetchEvents();
                })
                .catch(() => {
                    console.log(error);
                });
        }
    },
    events: function (selectInfo, successCallback, failureCallback) {
        // Laravelのイベント取得処理の呼び出し
        axios
            .post("http://localhost/schedule-get", {
                start_date: selectInfo.startStr.valueOf(),
                end_date: selectInfo.endStr.valueOf(),
            })
            .then((response) => {
                // console.log(response);

                // 追加したイベントを削除
                calendar.removeAllEvents();
                // カレンダーに読み込み
                successCallback(response.data);
            })
            .catch(() => {
                // バリデーションエラーなど
                alert("登録に失敗しました");
            });
    },
    
    eventClick:function(selectInfo,event,jsEvent){
        let selectId = selectInfo.event.id;
        // console.log(selectId);
        let title = prompt('予定を更新してください:'+selectInfo.event.title);
        if(title && title!=""){
            axios
                .post("http://localhost/schedule-update", {
                    id:selectId,
                    event_name: title,
                })
                .then(() => {
                    calendar.refetchEvents();
                })
                .catch((response) => {
                    console.log(response)
                    alert("編集に失敗しました");
                });
    }

},


});


calendar.render();
});