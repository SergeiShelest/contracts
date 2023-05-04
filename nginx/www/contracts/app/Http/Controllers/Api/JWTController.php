<?php

namespace App\Http\Controllers\Api;

use Ramsey\Uuid\Uuid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use App\Jobs\EmailSenderJob;
use App\Services\JWTService;


class JWTController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $request = $request->validated();

        $username = $request['username'];
        $password = password_hash($request['password'], PASSWORD_DEFAULT);
        $email = $request['email'];

        $accounts = Account::where('username', $username)->get();

        if($accounts->isNotEmpty()) {
            return response()->json([
                'message' => 'Account already exist.'
            ], 409);
        }

        $account = Account::create([
            'username' => $username,
            'password' => $password,
            'name' => $request['name'],
            'surname' => $request['surname'],
            'patronymic' => $request['patronymic'],
            'email' => $email,
            'phone' => $request['phone'],
            'email_verified' => false,
        ]);

        $acceptKey = (string) Uuid::uuid4();
        $emailAcceptUrl = 'http://localhost/api/auth/accept-email/'.$acceptKey;
        Redis::set('email_accept_key:'.$acceptKey, $account['id']);

        EmailSenderJob::dispatch(
            $email,
            'Проверка учетной записи по email',
            'Для активации вашей учетной записи, пожалуйста, пройдите по ссылке: '.$emailAcceptUrl
        );

        return new AccountResource($account);
    }

    public function login(LoginRequest $request)
    {
        $request = $request->validated();

        $username = $request['username'];
        $password = $request['password'];

        $accounts = Account::where('username', $username)->get();

        $errorResponse = response()->json([
            'message' => 'The username or password you entered is incorrect'
        ], 403);

        if ($accounts->isEmpty()) {
            return $errorResponse;
        }

        if (!password_verify($password, $accounts[0]['password'])) {
            return $errorResponse;
        }

        $payload = [
            'username' => $username,
        ];

        $jwtToken = JWTService::generateToken($payload);

        return response()->json([
            'data' => [
                'token'=> $jwtToken
            ]
        ], 200);
    }

    public function acceptEmail($acceptKey)
    {
        $accountId = Redis::get('email_accept_key:'.$acceptKey);

        if (!$accountId) {
            return response()->json([
                'message' => 'Invalid accept key.'
            ], 403);
        }

        $account = Account::find($accountId);
        $account->email_verified = true;
        $account->push();

        Redis::del('email_accept_key:'.$acceptKey);

        return response()->json([
            'message' => 'Accepted.'
        ], 200);
    }
}
