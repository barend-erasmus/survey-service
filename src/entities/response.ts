import { Answer } from './answer';

export class Response {
    constructor(
        public answers: Answer[],
        public profileId: string,
    ) {

    }
}
