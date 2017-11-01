// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { SurveyRepository } from './../repositories/sequelize/survey';

// Imports services
import { SurveyService } from './../services/survey';

// Imports models
import { Survey } from './../entities/survey';
import { Question } from './../entities/question';

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
        
        const survey: Survey = await UIRouter.getSurveyService().find('demo-profile-id', parseInt(req.body.id));

        for (const key of Object.keys(req.body)) {
            if (key !== 'id') {
                const questionId: number = parseInt(key.split('-')[1]);

                const question: Question = survey.questions.find((x) => x.id === questionId);

                if (question.type === 'multiple-choice') {
                    await UIRouter.getSurveyService().saveAnswer(questionId, 'demo-profile-id', [req.body[key]], null);
                } else if (question.type === 'checkbox') {
                    await UIRouter.getSurveyService().saveAnswer(questionId, 'demo-profile-id', req.body[key] instanceof Array ? req.body[key] : [req.body[key]], null);
                } else if (question.type === 'text') {
                    await UIRouter.getSurveyService().saveAnswer(questionId, 'demo-profile-id', [req.body[key]], null);
                }else {
                    throw new Error('');
                }
            }
        }

        res.render('thank-you', {
            survey,
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