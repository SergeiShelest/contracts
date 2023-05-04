import Twig from 'twig';

const createModal = ({title, content, btnTitle, onDone, onCancel}) => {
    $('body').prepend(Twig.twig({ ref: 'modal' }).render({title, content, btnTitle}));

    $('#modal-cancel').click(() => {
        onCancel();
        $('#modal').remove();
    });

    $('#modal-done').click(() => {
        if (onDone()) {
            $('#modal').remove();
        }
    });
}

export {createModal};