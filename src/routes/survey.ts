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
        const survey: Survey = await SurveyRouter.getSurveyService().create(
            'demo-profile-id',
            req.body.title,
            req.body.questions,
        );

        res.json(survey);
    }

    public static async update(req: express.Request, res: express.Response) {
        const survey: Survey = await SurveyRouter.getSurveyService().create(
            'demo-profile-id',
            req.body.title,
            req.body.questions,
        );

        res.json(survey);
    }

    public static async list(req: express.Request, res: express.Response) {
        const surveys = await SurveyRouter.getSurveyService().list('demo-profile-id');
        res.json(surveys);
    }

    protected static getSurveyService(): SurveyService {

        const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

        const surveyService: SurveyService = new SurveyService(surveyRepository);

        return surveyService;
    }
}
