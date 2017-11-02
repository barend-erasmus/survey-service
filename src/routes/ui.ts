// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { SurveyRepository } from './../repositories/sequelize/survey';

// Imports services
import { SurveyService } from './../services/survey';

// Imports models
import { Question } from './../entities/question';
import { Survey } from './../entities/survey';

export class UIRouter {

    public static async surveyDashboard(req: express.Request, res: express.Response) {
        res.render('survey/dashboard');
    }

    public static async surveyList(req: express.Request, res: express.Response) {
        const surveys: Survey[] = await UIRouter.getSurveyService().list('demo-profile-id');

        res.render('survey/list', {
            surveys,
        });
    }

    public static async surveyResults(req: express.Request, res: express.Response) {
        res.render('survey/results');
    }

    public static async surveyCreate(req: express.Request, res: express.Response) {
        res.render('survey/create', {});
    }

    public static async surveyEdit(req: express.Request, res: express.Response) {
        const survey: Survey = await UIRouter.getSurveyService().find('demo-profile-id', req.query.surveyId);

        res.render('survey/edit', {
            survey,
        });
    }

    public static async survey(req: express.Request, res: express.Response) {
        const survey: Survey = await UIRouter.getSurveyService().find('demo-profile-id', req.query.surveyId);

        res.render('survey', {
            layout: false,
            survey,
        });
    }

    public static async surveySubmit(req: express.Request, res: express.Response) {

        const survey: Survey = await UIRouter.getSurveyService().find('demo-profile-id', parseInt(req.body.id, undefined));

        for (const key of Object.keys(req.body)) {
            if (key !== 'id') {
                const questionId: number = parseInt(key.split('-')[1], undefined);

                const question: Question = survey.questions.find((x) => x.id === questionId);

                if (question.type === 'multiple-choice') {
                    await UIRouter.getSurveyService().saveAnswer(questionId, 'demo-profile-id', [req.body[key]], null);
                } else if (question.type === 'checkbox') {
                    await UIRouter.getSurveyService().saveAnswer(questionId, 'demo-profile-id', req.body[key] instanceof Array ? req.body[key] : [req.body[key]], null);
                } else if (question.type === 'text') {
                    await UIRouter.getSurveyService().saveAnswer(questionId, 'demo-profile-id', [req.body[key]], null);
                } else {
                    throw new Error('');
                }
            }
        }

        res.render('thank-you', {
            layout: false,
            survey,
        });
    }

    protected static getSurveyService(): SurveyService {

        const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

        const surveyService: SurveyService = new SurveyService(surveyRepository);

        return surveyService;
    }
}
