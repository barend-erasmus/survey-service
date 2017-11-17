import { Element } from './element';

export class Page {
    constructor(
        public elements: Element[],
        public id: number,
        public name: string,
        public order: number,
    ) {

    }
}
