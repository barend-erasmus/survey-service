export class Answer {
    constructor (
        public surveyId: number,
        public questionId: number,
        public profileId: string,
        public textValues: string[],
        public numericValue: number,
    ) {

    }
}
