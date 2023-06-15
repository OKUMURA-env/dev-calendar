<html>

<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body>
    <div id='calendar'></div>

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link href='{{ asset('fullcalendar-6.1.7/lib/main.css') }}' rel='stylesheet' />
    <script src='{{ asset('fullcalendar-6.1.7/lib/main.js') }}'></script>

</body>

</html>