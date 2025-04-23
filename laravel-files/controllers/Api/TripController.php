
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TripController extends Controller
{
    public function index()
    {
        $trips = Trip::with(['creator', 'activities'])
            ->where('created_by', Auth::id())
            ->orWhereHas('participants', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->get();

        return response()->json($trips);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $trip = Trip::create([
            ...$validated,
            'created_by' => Auth::id(),
        ]);

        $trip->participants()->attach(Auth::id(), ['role' => 'owner']);

        return response()->json($trip, 201);
    }

    public function show(Trip $trip)
    {
        $this->authorize('view', $trip);
        
        return response()->json($trip->load(['creator', 'activities', 'participants']));
    }

    public function update(Request $request, Trip $trip)
    {
        $this->authorize('update', $trip);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:draft,active,completed',
        ]);

        $trip->update($validated);

        return response()->json($trip);
    }

    public function destroy(Trip $trip)
    {
        $this->authorize('delete', $trip);
        
        $trip->delete();
        
        return response()->json(null, 204);
    }
}
