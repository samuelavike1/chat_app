<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::query()->where('sender_id', auth()->id())
            ->where('receiver_id', $user->id)
            ->orWhere('sender_id',$user->id)
            ->where('receiver_id',auth()->id())
            ->latest()
            ->paginate(10)
        ;

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages),

        ]);
    }

    public function byGroup(Group $group)
    {
        $messages = Message::query()->where('group_id', $group->id)
            ->latest()
            ->paginate(10)
        ;
        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        if ($message->group_id) {
            $messages = Message::query()->where('created_at','<', $message->created_at)
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10)
            ;
        } else {
            $messages = Message::query()->where('created_at', '<', $message->created_at)
                ->where( function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);
        }

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['sender_id'] = auth()->id();
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;
        $files = $data['attachments'] ?? [];


        $message = Message::query()->create($data);

        $attachments = [];
        if ($files) {

            foreach ($files as $file) {
                $directory = 'attachments/' .Str::random(32);
                Storage::makeDirectory($directory);

                $model =  [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->storeAs($directory, 'public'),
                ];

                $attachments = MessageAttachment::query()->create($model);
                $attachments[] = $attachments;
            }
            $message->attachments = $attachments;
        }

        if ($receiverId) {
            Conversation::updateConversationWithMessage($receiverId, auth()->id(), $message);
        }

        if ($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }

        SocketMessage::dispatch($message);

        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $message->delete();

        return response()->json('', 204);
    }
}
