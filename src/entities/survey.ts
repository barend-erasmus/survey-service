import { Question } from './question';

export class Survey {
    constructor(
        public id: number,
        public title: string,
        public questions: Question[],
    ) {

    }
}
