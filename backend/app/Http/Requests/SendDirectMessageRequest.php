<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        return [
            'recipient_id' => [
                'required',
                'exists:users,id',
            ],
            'body' => [
                'required',
                'string',
                'max:10000',
            ],
        ];
    }
}
