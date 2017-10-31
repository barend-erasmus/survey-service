// Imports
import { ISurveyRepository } from './../survey';

// Imports models
import { Survey } from './../../entities/survey';

export class SurveyRepository implements ISurveyRepository {

    private surveys: {} = {};

    public async create(profileId: string, survey: Survey): Promise<Survey> {
        if (!this.surveys[profileId]) {
            this.surveys[profileId] = [];
        }

        this.surveys[profileId].push(survey);

        return survey;
    }

    public async find(profileId: string, surveyId): Promise<Survey> {
        if (!this.surveys[profileId]) {
            this.surveys[profileId] = [];
        }

        return this.surveys[profileId].filter((x) => x.id === surveyId);
    }

    public async list(profileId: string): Promise<Survey[]> {
        if (!this.surveys[profileId]) {
            this.surveys[profileId] = [];
        }

        return this.surveys[profileId];
    }
}
