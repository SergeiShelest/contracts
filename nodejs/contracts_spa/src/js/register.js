import {initValidatorsOnChange, validateAll} from '../validator';
import {config} from "../config";

const load = () => {
    if (sessionStorage.getItem('token')) {
        location.hash = '';
    }

    initValidatorsOnChange();

    $('#register').click(() => {

        if (!validateAll()) {
            return;
        }

        const reqData = {
            username: $('#username').val(),
            password: $('#password').val(),
            name: $('#name').val(),
            surname: $('#surname').val(),
            patronymic: $('#patronymic').val(),
            email: $('#email').val(),
            phone: $('#phone').val()
        };

        $.ajax({
            url: config['API_URL'] + '/api/auth/signup',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'application/json',
            data: JSON.stringify(reqData),
            statusCode: {
                201: () => {
                    location.hash = '#login';
                },
                409: () => {
                    $('#error-message').text('A user with the same username already exists.');
                }
            }
        });
    });
};

export {load};