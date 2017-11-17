// Imports
import { ISurveyRepository } from './../survey';
import { BaseRepository } from './base';

// Imports models
import { Choice } from './../../entities/choice';
import { Element } from './../../entities/element';
import { Page } from './../../entities/page';
import { Survey } from './../../entities/survey';

export class SurveyRepository extends BaseRepository implements ISurveyRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(survey: Survey): Promise<Survey> {
        const result: any = await BaseRepository.models.Surveys.create({
            pages: survey.pages.map((page) => {
                return {
                    elements: page.elements.map((element) => {
                        return {
                            choices: element.choices ? element.choices.map((choice) => {
                                return {
                                    order: choice.order,
                                    text: choice.text,
                                    value: choice.value,
                                };
                            }) : [],
                            description: element.description,
                            maxRateDescription: null,
                            minRateDescription: null,
                            name: element.name,
                            order: element.order,
                            title: element.title,
                            type: element.type,
                        };
                    }),
                    name: page.name,
                    order: page.order,
                };
            }),
            profileId: survey.profileId,
            title: survey.title,
        }, {
                include: [
                    {
                        include: [
                            {
                                include: [
                                    { model: BaseRepository.models.Choices },
                                ],
                                model: BaseRepository.models.Elements,
                            },
                        ],
                        model: BaseRepository.models.Pages,
                    },
                ],
            });

        survey.identifier = result.id;

        return survey;
    }

    public async find(surveyId: number): Promise<Survey> {
        const survey: any = await BaseRepository.models.Surveys.find({
            include: [
                {
                    include: [
                        {
                            include: [
                                { model: BaseRepository.models.Choices },
                            ],
                            model: BaseRepository.models.Elements,
                        },
                    ],
                    model: BaseRepository.models.Pages,
                },
            ],
            where: {
                id: surveyId,
            },
        });

        if (!survey) {
            return null;
        }

        return new Survey(
            survey.cookieName,
            survey.id,
            survey.pages.map((page) => new Page(
                page.elements.map((element) => new Element(
                    element.choices.map((choice) => new Choice(parseInt(choice.order, undefined), choice.text, choice.value)).sort((a: Choice, b: Choice) => a.order - b.order),
                    element.choicesOrder,
                    element.description,
                    element.id,
                    element.inputType,
                    element.isRequired,
                    element.maxRateDescription,
                    element.minRateDescription,
                    element.name,
                    parseInt(element.order, undefined),
                    element.placeHolder,
                    element.rateMax,
                    element.rateMin,
                    element.rateStep,
                    element.title,
                    element.type,
                )).sort((a: Element, b: Element) => a.order - b.order),
                page.id,
                page.name,
                parseInt(page.order, undefined),
            )).sort((a: Page, b: Page) => a.order - b.order),
            survey.profileId,
            survey.title,
        );
    }

    public async list(profileId: string): Promise<Survey[]> {
        const surveys: any[] = await BaseRepository.models.Surveys.findAll({
            include: [
                {
                    include: [
                        {
                            include: [
                                { model: BaseRepository.models.Choices },
                            ],
                            model: BaseRepository.models.Elements,
                        },
                    ],
                    model: BaseRepository.models.Pages,
                },
            ],
            where: {
                profileId,
            },
        });

        return surveys.map((survey) => new Survey(
            survey.cookieName,
            survey.id,
            survey.pages.map((page) => new Page(
                page.elements.map((element) => new Element(
                    element.choices.map((choice) => new Choice(parseInt(choice.order, undefined), choice.text, choice.value)).sort((a: Choice, b: Choice) => a.order - b.order),
                    element.choicesOrder,
                    element.description,
                    element.id,
                    element.inputType,
                    element.isRequired,
                    element.maxRateDescription,
                    element.minRateDescription,
                    element.name,
                    parseInt(element.order, undefined),
                    element.placeHolder,
                    element.rateMax,
                    element.rateMin,
                    element.rateStep,
                    element.title,
                    element.type,
                )).sort((a: Element, b: Element) => a.order - b.order),
                page.id,
                page.name,
                parseInt(page.order, undefined),
            )).sort((a: Page, b: Page) => a.order - b.order),
            survey.profileId,
            survey.title,
        ));
    }

    public async update(survey: Survey): Promise<Survey> {
        return null;

    }

    // public async saveResponse(response: Response): Promise<Response> {
    //     const result: any = await BaseRepository.models.Responses.create({
    //         profileId: response.profileId,
    //         answers: response.answers.map((answer) => {
    //             return {
    //                 elementId: answer.element.id,
    //                 value: answer.value,
    //             };
    //         })
    //     });

    //     return response;
    // }
}
