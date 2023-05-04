import Twig from 'twig';
import {config} from '../config';
import {createModal} from "./components/modal";

const load = () => {
    const token = sessionStorage.getItem('token')

    if (!token) {
        location.hash = '#login';
        return;
    }

    $('#logout').click(() => {
        sessionStorage.clear();
        location.hash = '#login';
    });

    const statusCode = {
        200: (response) => {
            const responseData = JSON.parse( decodeURI(response.responseText) );
            const html = Twig.twig({ ref: 'cards' }).render({cards: responseData.data})
            $('.cont').html(html);

            $('.cards').off('click', '.card-delete').on('click', '.card-delete', (e) => {
                const contract = $(e.target).parent();
                const id = contract.attr('data-id');

                createModal({
                    title: 'Warning',
                    content: 'Delete contract ?',
                    btnTitle: "Delete",
                    onDone: () => {
                        $.ajax({
                            url: config['API_URL'] + '/api/contract/' + id,
                            method: 'DELETE',
                            dataType: 'application/json',
                            beforeSend: (xhr) => {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                            },
                            statusCode: {
                                200: () => { contract.remove(); }
                            }
                        });

                        return true;
                    },
                    onCancel: () => {}
                })
            });
        },
        403: (response) => {
            location.hash = '#login';
        }
    };

    $.ajax({
        url: config['API_URL'] + '/api/contract',
        method: 'GET',
        dataType: 'application/json',
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        statusCode: statusCode
    });

    $('#new-contract').click(() => {
        createModal({
            title: 'New contract',
            content: `
                <div class="col gap1">
                    <input id="contract-title" class="input st1" type="text" placeholder="Title">
                    <textarea id="contract-body" class="textarea st1" placeholder="Text"></textarea>
                </div>
            `,
            btnTitle: 'Save',
            onDone: () => {
                $.ajax({
                    url: config['API_URL'] + '/api/contract',
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'application/json',
                    data: JSON.stringify({
                        title: $('#contract-title').val(),
                        body: $('#contract-body').val()
                    }),
                    beforeSend: (xhr) => {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                    },
                    statusCode: {
                        201: (response) => {
                            const content = JSON.parse(response.responseText).data;
                            $('.cards').append(Twig.twig({href: 'card'}).render({card :content}));
                        }
                    }
                });

                return true;
            },
            onCancel: () => {  }
        });
    });
}

export {load};