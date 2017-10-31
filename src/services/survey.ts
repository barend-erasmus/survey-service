// Imports
import { config } from './../config';

// Imports repositories
import { ISurveyRepository } from './../repositories/survey';

// Imports models
import { Survey } from './../entities/survey';
import { Question } from './../entities/question';

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
        questions: Question[],
    ): Promise<Survey> {

        let survey = new Survey(null, title, questions);

        survey = await this.surveyRepository.create(profileId, survey);

        return survey;
    }
}
