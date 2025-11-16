<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SendDirectMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; # blocklist check?
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $ownerId = $this->user()->id;

        return [
            'recipient_id' => [
                'required',
                'exists:users,id',
                Rule::notIn([$ownerId]), // Prevent sending a message to yourself
            ],
            'body' => [
                'required',
                'string',
                'max:10000',
            ],
        ];
    }
}
