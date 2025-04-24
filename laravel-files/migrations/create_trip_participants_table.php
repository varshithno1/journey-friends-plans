
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trip_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained('travel_users')->onDelete('cascade');
            $table->enum('role', ['owner', 'participant'])->default('participant');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_participants');
    }
};
