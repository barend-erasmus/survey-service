// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { SurveyRepository } from './../repositories/sequelize/survey';

// Imports services
import { SurveyService } from './../services/survey';

// Imports models
import { Survey } from './../entities/survey';
import { Page } from '../entities/page';
import { Element } from '../entities/element';
import { Choice } from '../entities/choice';

export class SurveyRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {


            const body: Survey = req.body;

            let survey: Survey = new Survey(
                body.cookieName,
                body.id,
                body.title,
                body.pages.map((page) => new Page(
                    page.elements.map((element) => new Element(
                        element.type,
                        element.choices? element.choices.map((choice) => new Choice(
                            typeof(choice) === 'string'? choice : choice.value,
                            typeof(choice) === 'string'? choice : choice.text,
                        )) : null,
                        element.choicesOrder,
                        element.description,
                        element.inputType,
                        element.isRequired,
                        element.name,
                        element.placeHolder,
                        element.title,
                        element.rateMax,
                        element.rateMin,
                        element.rateStep,
                    )),
                    page.name,
                )),
                null,
            );

            survey = await SurveyRouter.getSurveyService().create(
                req.user.id,
                survey
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

    protected static getSurveyService(): SurveyService {

        const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

        const surveyService: SurveyService = new SurveyService(surveyRepository);

        return surveyService;
    }
}
