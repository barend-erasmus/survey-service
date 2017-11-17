// Imports
import { config } from './../config';

// Imports repositories
import { ISurveyRepository } from './../repositories/survey';
import { IPageRepository } from './../repositories/page';
import { IElementRepository } from './../repositories/element';

// Imports models
import { Element } from './../entities/element';
import { Page } from './../entities/page';
import { Survey } from './../entities/survey';

export class SurveyService {

    constructor(
        private elementRepository: IElementRepository,
        private pageRepository: IPageRepository,
        private surveyRepository: ISurveyRepository,
    ) {

    }

    public async create(
        profileId: string,
        survey: Survey,
    ): Promise<Survey> {

        survey.profileId = profileId;

        survey = await this.surveyRepository.create(survey);

        return survey;
    }

    public async find(profileId: string, surveyId: number): Promise<Survey> {
        const survey: Survey = await this.surveyRepository.find(surveyId);

        if (survey.profileId !== profileId) {
            throw new Error('Invalid Profile Id');
        }

        return survey;
    }

    public async list(profileId: string): Promise<Survey[]> {
        return this.surveyRepository.list(profileId);
    }

    public async update(
        profileId: string,
        survey: Survey,
    ): Promise<Survey> {

        survey.profileId = profileId;

        const existingSurvey: Survey = await this.surveyRepository.find(survey.id);

        for (const existingPage of existingSurvey.pages) {
            if (!survey.pages.find((page) => page.id === existingPage.id)) {
                await this.pageRepository.delete(existingPage);
            } else {
                for (const existingElement of existingPage.elements) {
                    if (!survey.pages.find((page) => page.id === existingPage.id).elements.find((element) => element.id === existingElement.id)) {
                        await this.elementRepository.delete(existingElement);
                    }
                }
            }
        }

        for (const page of survey.pages) {
            if (page.id === null) {
                await this.pageRepository.create(survey.id, page);
            } else {
                await this.pageRepository.update(page);

                for (const element of page.elements) {
                    if (element.id === null) {
                        await this.elementRepository.create(page.id, element);
                    } else {
                        await this.elementRepository.update(element);
                    }
                }
            }
        }

        return survey;
    }
}
