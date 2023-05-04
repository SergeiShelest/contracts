import {initRoutes} from "./router";

import index from "../public/templates/index.twig";
import login from "../public/templates/login.twig";
import register from "../public/templates/register.twig";


initRoutes([
    {
        url: '',
        templateHref: index,
        js: require('./js/index')
    },
    {
        url: '#login',
        templateHref: login,
        js: require('./js/login')
    },
    {
        url: '#register',
        templateHref: register,
        js: require('./js/register')
    },
]);