import { Question } from './question';

export class Survey {
    constructor(
        public id: number,
        public profileId: string,
        public title: string,
        public questions: Question[],
        public hasRespondents: boolean,
    ) {

    }
}
