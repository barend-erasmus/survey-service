// Imports
import { ISurveyRepository } from './../survey';

// Imports models
import { Response } from './../../entities/response';
import { Survey } from './../../entities/survey';

export class SurveyRepository implements ISurveyRepository {

    private surveys: Survey[] = [];

    public async create(survey: Survey): Promise<Survey> {
        survey.identifier = Math.floor(Math.random() * 1000);

        this.surveys.push(survey);

        return survey;
    }

    public async update(survey: Survey): Promise<Survey> {
        return survey;
    }

    public async find(surveyId: number): Promise<Survey> {
        const survey: Survey = this.surveys.find((x) => x.identifier === surveyId);

        return survey? survey : null;
    }

    public async list(profileId: string): Promise<Survey[]> {
        return this.surveys.filter((x) => x.profileId === profileId);
    }
}
