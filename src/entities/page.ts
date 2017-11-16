import { Element } from './element';

export class Page {
    constructor(
        public elements: Element[],
        public name: string,
        public order: number,
    ) {

    }
}
