// Imports models
import { Survey } from './../entities/survey';

export interface ISurveyRepository {

    create(survey: Survey): Promise<Survey>;
    update(survey: Survey): Promise<Survey>;
    find(surveyId: number): Promise<Survey>;
    list(profileId: string): Promise<Survey[]>;
}
