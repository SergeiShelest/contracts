import {initValidatorsOnChange, validateAll} from '../validator';
import {config} from "../config";

const load = () => {
    if (sessionStorage.getItem('token')) {
        location.hash = '';
    }

    initValidatorsOnChange();

    $('#login').click(() => {
        if (!validateAll()) {
            return;
        }

        const reqData = {
            username: $('#username').val(),
            password: $('#password').val(),
        };

        const statusCode = {
            200: (response) => {
                const responseData = $.parseJSON(response.responseText)
                sessionStorage.setItem("token", responseData['data']['token']);
                location.hash = '';
            },
            403: () => {
                $('#error-message').text('The username or password you entered is incorrect');
            }
        }

        $.ajax({
            url: config['API_URL'] + '/api/auth/login',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'application/json',
            data: JSON.stringify(reqData),
            statusCode: statusCode
        });
    });
};

export {load};