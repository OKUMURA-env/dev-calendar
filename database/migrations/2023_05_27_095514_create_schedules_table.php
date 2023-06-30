<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('start_date')->comment('開始時')->nullable();
            $table->string('end_date')->comment('終了時')->nullable();
            $table->string('event_name')->comment('イベント名');
            $table->string('color')->default('green');
            $table->boolean('all_day')->default(true)->comment('1なら通知あり。0なら通知なし。');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedules');
    }
};
