// Imports models
import { Answer } from './../entities/answer';
import { Survey } from './../entities/survey';

export interface ISurveyRepository {

    create(survey: Survey): Promise<Survey>;
    update(survey: Survey): Promise<Survey>;
    find(surveyId: number): Promise<Survey>;
    list(profileId: string): Promise<Survey[]>;

    saveAnswer(answer: Answer): Promise<boolean>;
}
