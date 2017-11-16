import { Choice } from './choice';

export class Element {
    constructor(
        public type: string,
        public choices: Choice[],
        public choicesOrder: string,
        public description: string,
        public inputType: string, 
        public isRequired: boolean,
        public name: string,
        public placeHolder: string,
        public title: string,
        public rateMax: number,
        public rateMin: number,
        public rateStep: number,
    ) {

    }
}