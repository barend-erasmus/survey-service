import { Element } from './../entities/element';

export interface IElementRepository {
    create(pageId: number, element: Element);
    delete(element: Element);
    update(element: Element);
}
