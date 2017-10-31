// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { SurveyRepository } from './../repositories/sequelize/survey';

// Imports services
import { SurveyService } from './../services/survey';

// Imports models
import { Survey } from './../entities/survey';

export class UIRouter {

    public static async surveys(req: express.Request, res: express.Response) {
        const surveys: Survey[] = await UIRouter.getSurveyService().list(req.query.profileId);

        res.render('surveys', {
            surveys,
        });
    }

    public static async survey(req: express.Request, res: express.Response) {
        const survey: Survey = await UIRouter.getSurveyService().find(req.query.profileId, req.query.surveyId);
        
        res.render('survey', {
            survey,
        });
    }

    public static async surveySubmit(req: express.Request, res: express.Response) {
        console.log(req.body);

        const survey: Survey = await UIRouter.getSurveyService().find(req.query.profileId, req.query.surveyId);
        
        res.render('survey', {
            survey,
        });
    }

    protected static getSurveyService(): SurveyService {

        const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

        const surveyService: SurveyService = new SurveyService(surveyRepository);

        return surveyService;
    }
}