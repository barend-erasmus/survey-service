export class Answer {
    constructor (
        public questionId: number,
        public profileId: string,
        public textValues: string[],
        public numericValue: number,
    ) {

    }
}
