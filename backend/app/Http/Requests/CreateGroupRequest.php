<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateGroupRequest extends FormRequest
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
        $ownerId = $this->user()->id;

        return [
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'avatar_url' => [
                'nullable',
                'url',
                'max:500',
            ],
            'participants' => [
                'required',
                'array',
                'min:1',
            ],
            'participants.*' => [
                'integer',
                'distinct',
                'exists:users,id',
                Rule::notIn([$ownerId]), // Owner is added automatically
            ],
        ];
    }
}
