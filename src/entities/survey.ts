import { Page } from './page';

export class Survey {
    constructor(
        public cookieName: string,
        public id: number,
        public title: string,
        public pages: Page[],
        public profileId: string,
    ) {

    }
}
