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

    public static async dashboard(req: express.Request, res: express.Response) {
        res.render('dashboard');
    }

    public static async surveys(req: express.Request, res: express.Response) {
        const surveys: Survey[] = await UIRouter.getSurveyService().list('demo-profile-id');

        res.render('surveys', {
            surveys,
        });
    }

    public static async survey(req: express.Request, res: express.Response) {
        const survey: Survey = await UIRouter.getSurveyService().find('demo-profile-id', req.query.surveyId);
        
        res.render('survey', {
            survey,
            layout: false,
        });
    }

    public static async surveySubmit(req: express.Request, res: express.Response) {
        console.log(req.body);

        res.render('thank-you', {
            layout: false,
        });
    }

    public static async surveyCreate(req: express.Request, res: express.Response) {
        res.render('survey-create', {});
    }

    public static async surveyEdit(req: express.Request, res: express.Response) {
        const survey: Survey = await UIRouter.getSurveyService().find('demo-profile-id', req.query.surveyId);

        res.render('survey-edit', {
            survey
        });
    }

    protected static getSurveyService(): SurveyService {

        const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

        const surveyService: SurveyService = new SurveyService(surveyRepository);

        return surveyService;
    }
}