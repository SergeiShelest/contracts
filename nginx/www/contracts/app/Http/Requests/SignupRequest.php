<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'username' => 'required|max:16',
            'password' => 'required|max:16',
            'name' => 'required|max:16',
            'surname' => 'required|max:16',
            'patronymic' => 'required|max:16',
            'email' => 'required|email|max:320',
            'phone' => 'required|digits:11',
        ];
    }
}
