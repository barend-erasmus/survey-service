// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { SurveyRepository } from './../repositories/sequelize/survey';

// Imports services
import { SurveyService } from './../services/survey';

// Imports models
import { Survey } from './../entities/survey';

export class SurveyRouter {

    public static async create(req: express.Request, res: express.Response) {
        await SurveyRouter.getSurveyService().create(
            req.body.profileId,
            req.body.title,
        );

        res.json('OK');
    }

    public static async list(req: express.Request, res: express.Response) {
        const surveys = await SurveyRouter.getSurveyService().list(req.query.profileId);
        res.json(surveys);
    }

    protected static getSurveyService(): SurveyService {

        const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

        const surveyService: SurveyService = new SurveyService(surveyRepository);

        return surveyService;
    }
}
