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

    /**
     * @api {post} /api/survey/create Create Survey
     * @apiName CreateSurvey
     * @apiGroup Survey
     *
     * @apiParam {string} title Title
     * @apiParam {object[]} questions Questions
     *
     *
     * @apiHeaderExample {json} Header-Example:
     *      {
     *          "Authorization": "Bearer <json-web-token>"
     *      }
     *
     * @apiSuccessExample {json} Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *      "id":3,
     *      "profileId":"demo-profile-id",
     *      "title":"Test Survey",
     *      "questions":[
     *          {
     *              "id":16,
     *              "text":"Are you employed or unemployed?",
     *              "type":"multiple-choice",
     *              "options":[
     *                  "Employed",
     *                  "Unemployed"
     *              ],
     *              "linearScaleMinimum":null,
     *              "linearScaleMaximum":null
     *          }
     *      ],
     *      "hasRespondents":false
     *      }
     */
    public static async create(req: express.Request, res: express.Response) {
        const survey: Survey = await SurveyRouter.getSurveyService().create(
            'demo-profile-id',
            req.body.title,
            req.body.questions,
        );

        res.json(survey);
    }

    public static async update(req: express.Request, res: express.Response) {
        const survey: Survey = await SurveyRouter.getSurveyService().update(
            'demo-profile-id',
            req.body.id,
            req.body.title,
            req.body.questions,
        );

        res.json(survey);
    }

    public static async list(req: express.Request, res: express.Response) {
        const surveys = await SurveyRouter.getSurveyService().list('demo-profile-id');
        res.json(surveys);
    }

    public static async find(req: express.Request, res: express.Response) {
        const survey = await SurveyRouter.getSurveyService().find('demo-profile-id', req.query.surveyId);
        res.json(survey);
    }

    public static async answerList(req: express.Request, res: express.Response) {
        const answers = await SurveyRouter.getSurveyService().listAnswers('demo-profile-id', parseInt(req.query.surveyId, undefined), parseInt(req.query.questionId, undefined));

        res.json({
            answers,
            questionId: parseInt(req.query.questionId, undefined),
            surveyId: parseInt(req.query.surveyId, undefined),
        });
    }

    protected static getSurveyService(): SurveyService {

        const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

        const surveyService: SurveyService = new SurveyService(surveyRepository);

        return surveyService;
    }
}
