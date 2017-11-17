// Imports
import { IResponseRepository } from './../response';
import { BaseRepository } from './base';

// Imports models
import { Response } from './../../entities/response';
import { Answer } from '../../entities/answer';
import { Choice } from '../../entities/choice';
import { Element } from '../../entities/element';

export class ResponseRepository extends BaseRepository implements IResponseRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(surveyId: number, response: Response): Promise<Response> {
        const result: any = await BaseRepository.models.Responses.create({
            answers: response.answers.map((answer) => {
                return {
                    elementId: answer.element.identifier,
                    value: answer.value,
                };
            }),
            profileId: response.profileId,
            surveyId,
        }, {
                include: [
                    { model: BaseRepository.models.Answers },
                ],
            });

        return response;
    }

    public async list(surveyId: number): Promise<Response[]> {
        const responses: any[] = await BaseRepository.models.Responses.findAll({
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
                    model: BaseRepository.models.Answers,
                },
            ],
            where: {
                surveyId: surveyId,
            },
        });

        return responses.map((response) => new Response(
            response.answers.map((answer) => new Answer(
                new Element(
                    answer.element.choices.map((choice) => new Choice(parseInt(choice.order, undefined), choice.text, choice.value)).sort((a: Choice, b: Choice) => a.order - b.order),
                    answer.element.choicesOrder,
                    answer.element.description,
                    answer.element.id,
                    answer.element.inputType,
                    answer.element.isRequired,
                    answer.element.maxRateDescription,
                    answer.element.minRateDescription,
                    answer.element.name,
                    parseInt(answer.element.order, undefined),
                    answer.element.placeHolder,
                    answer.element.rateMax,
                    answer.element.rateMin,
                    answer.element.rateStep,
                    answer.element.title,
                    answer.element.type,
                ),
                answer.value,
            )),
            response.profileId,
        ));
    }
}
