<?php

namespace App\Http\Controllers;

use App\Jobs\DeleteGroupJob;
use App\Models\Group;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;

class GroupController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];
        $group = Group::query()->create($data);
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));
        return redirect()->back();
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];
        $group->update($data);

        $group->users()->detach();
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        //check if the user is the owner of the group
        if ($group->owner_id !== auth()->id()){
            abort(403);
        }

        DeleteGroupJob::dispatch($group)->delay(now()->addSeconds(5));
        return response()->json(['message' => 'Group delete initiated']);
    }
}
