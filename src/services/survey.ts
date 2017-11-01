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

    public async find(profileId: string, surveyId: number): Promise<Survey> {
        const survey: Survey = await this.surveyRepository.find(surveyId);

        if (survey.profileId !== profileId) {
            throw new Error('');
        }

        return survey;
    }

    public async create(
        profileId: string,
        title: string,
        questions: Question[],
    ): Promise<Survey> {

        let survey = new Survey(null, profileId, title, questions);

        survey = await this.surveyRepository.create(survey);

        return survey;
    }
}
