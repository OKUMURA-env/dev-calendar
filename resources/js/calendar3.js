const events = [
	{
		id: "a",// ユニークID
		start: "2022-02-02",// イベント開始日
		end: "",// イベント終了日
		title: "節分",// イベントのタイトル
		description: "悪い鬼を追い払い福を招く",// イベントの詳細
		backgroundColor: "red",// 背景色
		borderColor: "red",// 枠線色
		editable: true// イベント操作の可否
	},
];

// IDを取得す
const elem = document.getElementById("my-calendar");
// FullCalendarオブジェクト
const calendar = new FullCalendar.Calendar(elem, {
	initialView: "dayGridMonth",// カレンダーの種類
	initialDate: "2022-02-13",// 表示対象の日付
	events: events,// カレンダーに表示するイベント
});