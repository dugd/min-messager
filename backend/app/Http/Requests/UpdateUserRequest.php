<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'string',
                'max:255',
            ],
            'username' => [
                'sometimes',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('users')->ignore($this->user()->id),
            ],
            'bio' => [
                'sometimes',
                'nullable',
                'string',
                'max:1000',
            ],
            'avatar_url' => [
                'sometimes',
                'nullable',
                'url',
                'max:500',
            ],
            'visibility' => [
                'sometimes',
                Rule::in(['public', 'private']),
            ],
        ];
    }
}
