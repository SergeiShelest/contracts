import pageNotFound from '../public/templates/404.twig';

import Twig from 'twig';

const router = (routes) => {
    const route = routes.find(r => r.url === location.hash);

    if (!route) {
        location.hash = "#404";
        return;
    }

    if (!route.template) {
        route.template = Twig.twig({
            id: route.url,
            href: route.templateHref,
            async: false
        });
    }

    document.body.innerHTML = route.template.render();

    if (route.js) {
        route.js.load();
    }
};

const initRoutes = (routes) => {

    routes.push({
        url: '#404',
        templateHref: pageNotFound
    })

    const wrapper = () => {
        router(routes);
    };

    window.addEventListener('hashchange', wrapper);
    window.addEventListener('load', wrapper);
};

export {initRoutes};