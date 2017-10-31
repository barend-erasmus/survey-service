export class Question {
    constructor(
        public id: number,
        public text: string,
        public type: string,
        public options: string[],
        public linearScaleMinimum: number,
        public linearScaleMaximum: number,
    ) {

    }
}
