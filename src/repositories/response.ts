import { Response } from './../entities/response';

export interface IResponseRepository {
    create(response: Response);
    update(response: Response);
}
