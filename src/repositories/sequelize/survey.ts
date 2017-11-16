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
            title: survey.title,
            pages: survey.pages.map((page) => {
                return {
                    elements: page.elements.map((element) => {
                        return {
                            choices: element.choices ? element.choices.map((choice) => {
                                return {
                                    value: choice.value,
                                    text: choice.text,
                                };
                            }) : [],
                            name: element.name,
                            type: element.type,
                        };
                    }),
                    name: page.name,
                };
            }),
            profileId: survey.profileId,
        }, {
                include: [
                    {
                        include: [
                            {
                                include: [
                                    { model: BaseRepository.models.Choices }
                                ],
                                model: BaseRepository.models.Elements
                            },
                        ],
                        model: BaseRepository.models.Pages,
                    },
                ],
            });

        survey.id = result.id;

        return survey;
    }

    public async update(survey: Survey): Promise<Survey> {
        return survey;

    }

    public async find(surveyId: number): Promise<Survey> {
        const survey: any = await BaseRepository.models.Surveys.find({
            include: [
                {
                    include: [
                        {
                            include: [
                                { model: BaseRepository.models.Choices }
                            ],
                            model: BaseRepository.models.Elements
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
            survey.title,
            survey.pages.map((page) => new Page(
                page.elements.map((element) => new Element(element.type,
                    element.choices.map((choice) => new Choice(choice.value, choice.text)),
                    element.choicesOrder,
                    element.description,
                    element.inputType,
                    element.isRequired,
                    element.name,
                    element.placeHolder,
                    element.title,
                    element.rateMax,
                    element.rateMin,
                    element.rateStep
                )),
                page.name,
            )),
            survey.profileId,
        );
    }

    public async list(profileId: string): Promise<Survey[]> {
        const surveys: any[] = await BaseRepository.models.Surveys.findAll({
            include: [
                {
                    include: [
                        {
                            include: [
                                { model: BaseRepository.models.Choices }
                            ],
                            model: BaseRepository.models.Elements
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
            survey.title,
            survey.pages.map((page) => new Page(
                page.elements.map((element) => new Element(element.type,
                    element.choices.map((choice) => new Choice(choice.value, choice.text)),
                    element.choicesOrder,
                    element.description,
                    element.inputType,
                    element.isRequired,
                    element.name,
                    element.placeHolder,
                    element.title,
                    element.rateMax,
                    element.rateMin,
                    element.rateStep
                )),
                page.name,
            )),
            survey.profileId,
        ));
    }
}
