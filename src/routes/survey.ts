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
        try {
            const survey: Survey = await SurveyRouter.getSurveyService().create(
                req.user.id,
                req.body.title,
                req.body.questions,
            );

            res.json(survey);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        try {
            const survey: Survey = await SurveyRouter.getSurveyService().update(
                req.user.id,
                req.body.id,
                req.body.title,
                req.body.questions,
            );

            res.json(survey);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            const surveys = await SurveyRouter.getSurveyService().list(req.user.id);
            res.json(surveys);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            const survey = await SurveyRouter.getSurveyService().find(req.user.id, req.query.surveyId);
            res.json(survey);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async answerList(req: express.Request, res: express.Response) {
        try {
            const answers = await SurveyRouter.getSurveyService().listAnswers(req.user.id, parseInt(req.query.surveyId, undefined), parseInt(req.query.questionId, undefined));

            res.json({
                answers,
                questionId: parseInt(req.query.questionId, undefined),
                surveyId: parseInt(req.query.surveyId, undefined),
            });
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    protected static getSurveyService(): SurveyService {

        const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

        const surveyService: SurveyService = new SurveyService(surveyRepository);

        return surveyService;
    }
}
