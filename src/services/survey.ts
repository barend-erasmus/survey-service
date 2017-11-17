// Imports
import { config } from './../config';

// Imports repositories
import { IElementRepository } from './../repositories/element';
import { IPageRepository } from './../repositories/page';
import { IResponseRepository } from './../repositories/response';
import { ISurveyRepository } from './../repositories/survey';

// Imports models
import { Answer } from '../entities/answer';
import { Element } from './../entities/element';
import { Page } from './../entities/page';
import { Response } from './../entities/response';
import { Survey } from './../entities/survey';

export class SurveyService {

    constructor(
        private elementRepository: IElementRepository,
        private pageRepository: IPageRepository,
        private responseRepository: IResponseRepository,
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

    public async response(surveyId: number, profileId: string, data: {}): Promise<Response> {

        const survey: Survey = await this.surveyRepository.find(surveyId);

        const elements: Element[] = [].concat.apply([], survey.pages.map((page) => {
            return page.elements;
        }));

        const response: Response = new Response([], profileId);

        for (const key of Object.keys(data)) {

            const element: Element = elements.find((x) => x.name === key);

            if (typeof (data[key]) === 'string') {
                response.answers.push(new Answer(element, data[key]));
            } else {
                for (const value of data[key]) {
                    response.answers.push(new Answer(element, value));
                }
            }
        }

        await this.responseRepository.create(surveyId, response);

        return response;
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
