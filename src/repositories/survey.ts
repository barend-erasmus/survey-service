// Imports models
import { Survey } from './../entities/survey';
import { Response } from './../entities/response';

export interface ISurveyRepository {
    create(survey: Survey): Promise<Survey>;
    find(surveyId: number): Promise<Survey>;
    list(profileId: string): Promise<Survey[]>;
    update(survey: Survey): Promise<Survey>;
}
