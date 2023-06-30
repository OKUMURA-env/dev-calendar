<html>

<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

    <!--CSS-->
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@3.10.5/dist/fullcalendar.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@3.10.5/dist/fullcalendar.print.css" rel="stylesheet" media="print">
    <script src="https://cdn.jsdelivr.net/npm/moment@2/min/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@3.10.5/dist/fullcalendar.min.js"></script>
 

    <style>
        html,
        body {
            margin: 0;
            padding: 0;
            font-family: "Lucida Grande", Helvetica, Arial, Verdana, sans-serif;
            font-size: 14px;
        }

        #external-events {
            position: fixed;
            z-index: 2;
            top: 20px;
            left: 30px;
            width: 180px;
            padding: 0 10px;
            border: 1px solid #ccc;
            background: #eee;
        }

        .demo-topbar+#external-events {
            /* will get stripped out */
            top: 60px;
        }

        #external-events .fc-event {
            margin: 1em 0;
            cursor: move;
        }

        #calendar-container {
            position: relative;
            z-index: 1;
            margin-left: 200px;
        }

        #calendar {
            max-width: 1000px;

            margin: 20px auto;
        }
    </style>



</head>

<body>

    <div id='external-events' class="col-2 ">
        <p>
            <strong>Draggable Events</strong>
        </p>
        <input type="hidden" name="event_name" id="event_name_1" value="My Event 1"><div class="fc-event ui-draggable ui-draggable-handle" style="background-color:green;border-color:green;">My Event 1</div>
        <input type="hidden" name="event_name" id="event_name_2" value="My Event 2"><div class="fc-event ui-draggable ui-draggable-handle" style="background-color:red;border-color:red;">My Event 2</div>
        <input type="hidden" name="event_name" id="event_name_3" value="My Event 3"><div class="fc-event ui-draggable ui-draggable-handle" style="background-color:blue;border-color:blue;">My Event 3</div>
        <input type="hidden" name="event_name" id="event_name_4" value="My Event 4"><div class="fc-event ui-draggable ui-draggable-handle" style="background-color:pink;border-color:pink;">My Event 4</div>
        <input type="hidden" name="event_name" id="event_name_5" value="My Event 5"><div class="fc-event ui-draggable ui-draggable-handle" style="background-color:orange;border-color:orange;">My Event 5</div>
    </div>
    <div id='calendar' class="col-10"></div>

    <div class="modal" tabindex="-1" role="dialog" id="create_modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">予定の登録</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="閉じる" id=create_modal_close>
                        <span aria-hidden="true">×</span>
                    </button>
                </div><!-- /.modal-header -->
                <div class="modal-body">
                    <h5>タイトル</h5>
                    <input type="text" name="event_name" id="event_name">
                    <div>
                    <h5>日時</h5>
                    <input type="checkbox" id="all_day" checked = "checked">終日
                    <p>開始日</p>
                    <input type="date" name="start_date" id="start_date">
                    <input type="time" name="start_time" id="start_time" style=display:none;>
                    <p>終了日</p>
                    <input type="date" name="end_date" id="end_date">
                    <input type="time" name="end_time" id="end_time" style=display:none;>
                    </div>
                    <h5>カラー</h5>
                    <input type="color" name="color" id="color">

                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="buttom" class="btn btn-primary" id="event_create">登録</button>
                </div><!-- /.modal-footer -->
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <div class="modal" tabindex="-1" role="dialog" id="edit_modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">予定の詳細</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="閉じる" id="edit_modal_close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div><!-- /.modal-header -->
                <div class="modal-body">
                    {{--id取得--}}
                    <input type="hidden" name="id" id="id">
                    <h5>タイトル</h5>
                    <input type="text" name="edit_event_name" id="edit_event_name">
                    <div>
                    <h5>日時</h5>
                    <input type="checkbox" id="edit_all_day">終日
                    <p>開始日</p>
                    <input type="date" name="edit_start_date" id="edit_start_date">
                    <input type="time" name="edit_start_time" id="edit_start_time">
                    <p>終了日</p>
                    <input type="date" name="edit_end_date" id="edit_end_date">
                    <input type="time" name="edit_end_time" id="edit_end_time">
                    </div>
                    <h5>カラー</h5>
                    <input type="color" name="color" id="color">

                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="event_destroy">削除</button>
                    <button type="button" class="btn btn-primary" id="event_update">更新</button>
                </div><!-- /.modal-footer -->
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->


    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link href='{{ asset('fullcalendar-6.1.7/lib/main.css') }}' rel='stylesheet' />
    <script src='{{ asset('fullcalendar-6.1.7/lib/main.js') }}'></script>


    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->


    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>





    <script>
        //モーダル閉じる
        $(function() {
            $('#edit_modal_close').on('click', function() {
                $('#edit_modal').modal('hide');

            });
        })

        $(function() {
            $('#create_modal_close').on('click', function() {
                $('#create_modal').modal('hide');

            });
        })
    </script>

</body>

</html>