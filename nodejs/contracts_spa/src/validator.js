const validators = [
    {
        name: 'empty',
        validator(val) { return val === ''; },
        message: 'Empty.'
    },
    {
        name: 'max',
        validator(val, [maxLength]) { return val.length > parseInt(maxLength); },
        message: 'Max length.'
    }
]

const callValidator = (name, args, val) => {
    const validator = validators.find((validator) => {
        return validator.name === name
    });

    if (validator?.validator(val, args)) {
        return validator.message;
    }
}

const validateInput = (input) => {
    const value = input.value;
    const validatorsAtr = input.getAttribute('data-validators');
    const validators = validatorsAtr.split('|');
    let message = '';

    for (const validator of validators) {
        let [validatorName, validatorArgs] = validator.split(':');

        if (validatorArgs) {
            validatorArgs = validatorArgs.split(',');
        }
        else {
            validatorArgs = [];
        }

        message = callValidator(validatorName, validatorArgs, value);

        if (message) {
            break;
        }
    }

    $(input).parent().find('span').text(message ? message : '');
    return !message;
}

const selector = 'input[data-validators]';

const initValidatorsOnChange = () => {
    $(selector).wrap('<div class="col"></div>').parent().append('<span></span>');
    $(selector).change((e) => {
        const input = e.target;
        validateInput(input);
    });
};

const validateAll = () => {
    let isValid = true

    $(selector).each((index, element) => {
        if (!validateInput(element)) { isValid = false; }
    });

    return isValid;
}

export {initValidatorsOnChange, validateAll};