
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripParticipant extends Model
{
    use HasFactory;

    protected $table = 'trip_participants';

    protected $fillable = [
        'trip_id',
        'user_id',
        'role',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
