import Twig from 'twig';

import card from "../public/templates/components/card.twig";
import cards from "../public/templates/components/cards.twig";
import modal from "../public/templates/components/modal.twig";

Twig.twig({
    id: 'card',
    href: card,
    async: false
});

Twig.twig({
    id: 'cards',
    href: cards,
    async: false
});

Twig.twig({
    id: 'modal',
    href: modal,
    async: false
});