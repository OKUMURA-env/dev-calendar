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

        views: {
            dayGridTwoWeek: {
              type: 'dayGrid',
              buttonText: '2週間',
              duration: { weeks: 2 }
            }
        },
         
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridTwoWeek,timeGridWeek,listMonth",
        },
        buttonText: {
            today: "今日",
            week: "週",
            month: "月",
            list: "一覧",
        },
        

        noEventsContent: "スケジュールはありません",

        // 日付をクリックしたイベント
        dateClick: function (selectInfo,allDay) {
            let date = selectInfo.dateStr;
            
            $("#create_modal").modal("show");
            $("#event_name").val("");
            $("#start_date").val(date);
            $("#start_time").val();
            $("#end_date").val(date);
            $("#end_time").val();
            $("#color").val("");
        },

        

        //週表記の終日表示のありなし
        allDaySlot: true,
        // 終日スロットのタイトル　デフォはall-day
        allDayText: '終日',

        events: function (selectInfo, successCallback, failureCallback) {
            // Laravelのイベント取得処理の呼び出し
            axios
                .post("http://localhost/schedule-get", {
                    start_date: selectInfo.startStr.valueOf(),
                    end_date: selectInfo.endStr.valueOf(),
                })
                .then((response) => {
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

        eventClick: function (selectInfo, event, jsEvent) {
            let id = selectInfo.event.id;
            let event_name = selectInfo.event.title;
            let start = selectInfo.event.startStr;
            let start_date = start.slice(0,10);
            let start_time = start.slice(11,16)
            let end = selectInfo.event.endStr;
            let end_date = end.slice(0,10);
            let end_time = end.slice(11,16);

            $("#edit_modal").modal("show");

            $("#id").val(id);
            $("#edit_event_name").val(event_name);
            $("#edit_start_date").val(start_date);
            $("#edit_start_time").val(start_time);
            $("#edit_end_date").val(end_date);
            $("#edit_end_time").val(end_time);
        },

        droppable: true,
        eventReceive: function(selectInfo) {
            console.log(selectInfo);
            let event_name = selectInfo.draggedEl.innerText;
            let drop_date = selectInfo.event.startStr;
            let all_day = selectInfo.event.allDay;
        
            axios
            .post("http://localhost/schedule-add", {
                start_date: drop_date,
                end_date: drop_date,
                event_name: event_name,
                color: "green",
                all_day: all_day,
                
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
        let start_time = $("#start_time").val();
        let start_date = $("#start_date").val()+" "+$("#start_time").val();
        let end_date = $("#end_date").val()+" "+$("#end_time").val();
        let color = $("#color").val();
        let all_day = $("#all_day").prop("checked");
        
        axios
            .post("http://localhost/schedule-add", {
                start_date: start_date,
                end_date: end_date,
                event_name: event_name,
                color: color,
                all_day: all_day,
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
        let start_date = $("#edit_start_date").val()+" "+$("#edit_start_time").val();
        let end_date = $("#edit_end_date").val()+" "+$("#edit_end_time").val();

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

//時間フォームの表示・非表示 (終日チェックボックス)
$(function () {
    $("#all_day").change(function () {
        if ($(this).prop("checked")) {
            $("#start_time").hide("");
            $("#end_time").hide("");

            $("#start_time").val("");
            $("#end_time").val("");
        } else {
            $("#start_time").show("");
            $("#end_time").show("");
            
        }
    });
});

$(function () {
    $("#edit_all_day").change(function () {
        if ($(this).prop("checked")) {
            $("#edit_start_time").hide("");
            $("#edit_end_time").hide("");

            $("#edit_start_time").val("");
            $("#edit_end_time").val("");
        } else {
            $("#edit_start_time").show("");
            $("#edit_end_time").show("");
            
        }
    });
});
