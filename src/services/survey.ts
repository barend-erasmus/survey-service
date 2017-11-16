// Imports
import { config } from './../config';

// Imports repositories
import { ISurveyRepository } from './../repositories/survey';

// Imports models
import { Element } from './../entities/element';
import { Page } from './../entities/page';
import { Survey } from './../entities/survey';

export class SurveyService {

    constructor(private surveyRepository: ISurveyRepository) {

    }

    public async list(profileId: string): Promise<Survey[]> {
        return this.surveyRepository.list(profileId);
    }

    public async find(profileId: string, surveyId: number): Promise<Survey> {
        const survey: Survey = await this.surveyRepository.find(surveyId);

        if (survey.profileId !== profileId) {
            throw new Error('Invalid Profile Id');
        }

        return survey;
    }

    public async create(
        profileId: string,
        survey: Survey,
    ): Promise<Survey> {

        survey.profileId = profileId;

        survey = await this.surveyRepository.create(survey);

        return survey;
    }

    public async update(
        profileId: string,
        survey: Survey,
    ): Promise<Survey> {

        survey.profileId = profileId;

        survey = await this.surveyRepository.update(survey);

        return survey;
    }
}
