<?php

namespace App\Services;


class JWTService
{
    private static $HEADER = [
        'alg' => 'HS256',
        'typ' => 'JWT'
    ];

    public static function generateToken($payload)
    {
        $payload['exp'] = time() + self::lifeTime();

        $tokenParts = self::encodeToken(self::$HEADER, $payload);
        $token = implode(".", $tokenParts);

        return $token;
    }

    public static function isValid($token)
    {
        $tokenParts = self::decodeToken($token);

        if (!$tokenParts) { return false; }

        $header = $tokenParts[0];
        $payload = $tokenParts[1];
        $signature = $tokenParts[2];

        if (!array_key_exists("exp", $payload)) { return false; }

        $expiration = $payload->exp;
        $is_token_expired = ($expiration - time()) < 0;

        $correct_signature = self::encodeToken(self::$HEADER, $payload)[2];
        $is_signature_valid = ($correct_signature === $signature);

        return !($is_token_expired || !$is_signature_valid);
    }

    public static function encodeToken($header, $payload)
    {
        $headers_encoded = self::base64UrlEncode(json_encode($header));
        $payload_encoded = self::base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('SHA256', "$headers_encoded.$payload_encoded", self::secret(), true);
        $signature_encoded = self::base64UrlEncode($signature);

        return [$headers_encoded, $payload_encoded, $signature_encoded];
    }

    public static function decodeToken($token)
    {
        $tokenParts = explode('.', $token);

        if (count($tokenParts) !== 3) { return null; }

        $header = json_decode(base64_decode($tokenParts[0]));
        $payload = json_decode(base64_decode($tokenParts[1]));
        $signature = $tokenParts[2];

        if (!$header || !$payload) { return null; }

        return [$header, $payload, $signature];
    }

    private static function base64UrlEncode($str)
    {
        return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
    }

    private static function secret()
    {
        return config('jwt.secret');
    }

    private static function lifeTime()
    {
        return config('jwt.token_life_time');
    }
}
