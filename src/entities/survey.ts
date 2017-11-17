import { Page } from './page';

export class Survey {
    constructor(
        public cookieName: string,
        public identifier: number,
        public pages: Page[],
        public profileId: string,
        public title: string,
    ) {

    }
}
