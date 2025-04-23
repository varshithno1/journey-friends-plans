
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function store(Request $request, Trip $trip)
    {
        $this->authorize('update', $trip);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
            'location' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
        ]);

        $activity = $trip->activities()->create($validated);

        return response()->json($activity, 201);
    }

    public function update(Request $request, Trip $trip, Activity $activity)
    {
        $this->authorize('update', $trip);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
            'location' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
        ]);

        $activity->update($validated);

        return response()->json($activity);
    }

    public function destroy(Trip $trip, Activity $activity)
    {
        $this->authorize('update', $trip);
        
        $activity->delete();
        
        return response()->json(null, 204);
    }
}
