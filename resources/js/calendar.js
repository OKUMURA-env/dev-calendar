import { Calendar } from "@fullcalendar/core";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
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
var calendar = null;
document.addEventListener("DOMContentLoaded", function () {
    var containerEl = document.getElementById("external-events");
    let draggableEl = document.getElementById("mydraggable");
    var calendarEl = document.getElementById("calendar");

    // initialize the external events 追加
    new Draggable(containerEl, {
        itemSelector: '.fc-event',
            eventData: function(eventEl) {
                return {
                    title: eventEl.innerText
                };
            }
    });

    calendar = new Calendar(calendarEl, {
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

        // 日付をクリックしたイベント
        dateClick: function (selectInfo) {
            let date = selectInfo.dateStr;
            
            console.log(selectInfo);
            $("#create_modal").modal("show");
            $("#event_name").val("");
            $("#start_date").val(date);
            $("#end_date").val(date);
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
        
        // eventColor:'green',

        eventClick: function (selectInfo, event, jsEvent) {
            console.log(selectInfo);
            let id = selectInfo.event.id;
            let event_name = selectInfo.event.title;
            let start_date = selectInfo.event.startStr;
            let end_date = selectInfo.event.endStr;
            console.log(end_date);

            $("#edit_modal").modal("show");

            $("#id").val(id);
            $("#edit_event_name").val(event_name);
            $("#edit_start_date").val(start_date);
            $("#edit_end_date").val(end_date);
        },

        droppable: true,
        eventReceive: function(selectInfo) {
            let event_name = selectInfo.draggedEl.innerText;
            let drop_date = selectInfo.event.startStr;
            console.log(event_name);
            console.log(drop_date);

            axios
            .post("http://localhost/schedule-add", {
                start_date: drop_date,
                end_date: drop_date,
                event_name: event_name,
                
            })
            .then((response) => {
                calendar.refetchEvents();
                $("#create_modal").modal("hide");
            })
            .catch(() => {
                // バリデーションエラーなど
                alert("登録に失敗しました");
            });
        
        },
   
        editable: true,
        eventDrop: function (selectInfo, delta, revertFunc, jsEvent, ui, view) {
            
            axios
                .post("http://localhost/schedule-update", {
                    id: selectInfo.event.id,
                    start_date: selectInfo.event.startStr,
                    end_date: selectInfo.event.endStr,
                    event_name: selectInfo.event.title,
                })
                .then(() => {
                    calendar.refetchEvents();
                })
                .catch(() => {
                    alert("失敗しました");
                });
        },

        eventResize: function (selectInfo) {
            axios
                .post("http://localhost/schedule-update", {
                    id: selectInfo.event.id,
                    start_date: selectInfo.event.startStr,
                    end_date: selectInfo.event.endStr,
                    event_name: selectInfo.event.title,
                })
                .then(() => {
                    calendar.refetchEvents();
                })
                .catch(() => {
                    alert("失敗しました");
                });
        },
    });

    calendar.render();
});

$(function () {
    $("#event_create").on("click", function () {
        let event_name = $("#event_name").val();
        let start_date = $("#start_date").val();
        let end_date = $("#end_date").val();
        console.log(event_name);
        axios
            .post("http://localhost/schedule-add", {
                start_date: start_date,
                end_date: end_date,
                event_name: event_name,
            })
            .then((response) => {
                calendar.refetchEvents();
                $("#create_modal").modal("hide");
            })
            .catch(() => {
                // バリデーションエラーなど
                alert("登録に失敗しました");
            });
    });
});

$(function () {
    $("#event_update").on("click", function () {
        let id = $("#id").val();
        let event_name = $("#edit_event_name").val();
        let start_date = $("#edit_start_date").val();
        let end_date = $("#edit_end_date").val();

        axios
            .post("http://localhost/schedule-update", {
                id: id,
                start_date: start_date,
                end_date: end_date,
                event_name: event_name,
            })
            .then((response) => {
                calendar.refetchEvents();
                $("#edit_modal").modal("hide");
            })
            .catch(() => {
                // バリデーションエラーなど
                alert("登録に失敗しました");
            });
    });
});

$(function () {
    $("#event_destroy").on("click", function () {
        let id = $("#id").val();

        if (!confirm("本当に削除しますか？")) {
            return false;
        } else {
            axios
                .post("http://localhost/schedule-destroy", {
                    id: id,
                })
                .then((response) => {
                    calendar.refetchEvents();
                    $("#edit_modal").modal("hide");
                })
                .catch(() => {
                    // バリデーションエラーなど
                    alert("登録に失敗しました");
                });
        }
    });
});


    
