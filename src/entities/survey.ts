import { Page } from './page';

export class Survey {
    constructor(
        public completeText: string,
        public cookieName: string,
        public goNextPageAutomatic: boolean,
        public identifier: number,
        public pages: Page[],
        public profileId: string,
        public showCompletedPage: boolean,
        public showProgressBar: boolean,
        public title: string,
    ) {

    }
}
