// Imports
import { IResponseRepository } from './../response';
import { BaseRepository } from './base';

// Imports models
import { Response } from './../../entities/response';

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
}
