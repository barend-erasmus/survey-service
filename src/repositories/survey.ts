// Imports models
import { Survey } from './../entities/survey';

export interface ISurveyRepository {

    create(profileId: string, survey: Survey): Promise<Survey>;
    find(profileId: string, surveyId): Promise<Survey>;
    list(profileId: string): Promise<Survey[]>;
}
