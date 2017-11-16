import { Choice } from './choice';

export class Element {
    constructor(
        public choices: Choice[],
        public choicesOrder: string,
        public description: string,
        public inputType: string,
        public isRequired: boolean,
        public name: string,
        public order: number,
        public placeHolder: string,
        public rateMax: number,
        public rateMin: number,
        public rateStep: number,
        public title: string,
        public type: string,
    ) {

    }
}
