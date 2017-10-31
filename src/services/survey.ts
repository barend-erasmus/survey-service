// Imports
import { config } from './../config';

// Imports repositories
import { ISurveyRepository } from './../repositories/survey';

// Imports models
import { Survey } from './../entities/survey';

export class SurveyService {

    constructor(private surveyRepository: ISurveyRepository) {

    }

    public async list(profileId: string): Promise<Survey[]> {
        return this.surveyRepository.list(profileId);
    }

    public async find(profileId: string, surveyId: string): Promise<Survey> {
        return this.surveyRepository.find(profileId, surveyId);
    }

    public async create(
        profileId: string,
        title: string,
    ): Promise<Survey> {

        const survey = new Survey(null, title, null);

        await this.surveyRepository.create(profileId, survey);

        return survey;
    }
}
