<?php

return [
    'secret' => env('JWT_SECRET', 'SUPER_SECRET_KEY'),
    'token_life_time' => env('JWT_TOKEN_LIFE_TIME', 300)
];
