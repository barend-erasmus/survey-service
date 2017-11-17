import { Response } from './../entities/response';

export interface IResponseRepository {
    create(surveyId: number, response: Response): Promise<Response>;
    list(surveyId: number): Promise<Response[]>;
}
