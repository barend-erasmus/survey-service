// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { ElementRepository } from './../repositories/sequelize/element';
import { PageRepository } from './../repositories/sequelize/page';
import { ResponseRepository } from './../repositories/sequelize/response';
import { SurveyRepository } from './../repositories/sequelize/survey';

// Imports services
import { StatisticsService } from './../services/statistics';
import { SurveyService } from './../services/survey';

// Imports models
import { Choice } from '../entities/choice';
import { Element } from '../entities/element';
import { Page } from '../entities/page';
import { Survey } from './../entities/survey';
import { Response } from './../entities/response';

export class SurveyRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {

            const body: Survey = req.body;

            let survey: Survey = new Survey(
                body.completeText,
                body.cookieName,
                body.goNextPageAutomatic,
                body.identifier,
                body.pages.map((page, pageOrder) => new Page(
                    page.elements.map((element, elementOrder) => new Element(
                        element.choices ? element.choices.map((choice, choiceOrder) => new Choice(
                            choiceOrder,
                            typeof (choice) === 'string' ? choice : choice.text,
                            typeof (choice) === 'string' ? choice : choice.value,
                        )) : null,
                        element.choicesOrder,
                        element.description,
                        element.identifier,
                        element.inputType,
                        element.isRequired,
                        element.maxRateDescription,
                        element.minRateDescription,
                        element.name,
                        elementOrder,
                        element.placeHolder,
                        element.rateMax,
                        element.rateMin,
                        element.rateStep,
                        element.title,
                        element.type,
                    )),
                    page.identifier,
                    page.name,
                    pageOrder,
                )),
                null,
                body.showCompletedPage,
                body.showProgressBar,
                body.title,
            );

            survey = await SurveyRouter.getSurveyService().create(
                req.user.id,
                survey,
            );

            res.json(survey);
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

    public static async response(req: express.Request, res: express.Response) {
        try {

            await SurveyRouter.getSurveyService().response(req.body.surveyId, req.user.id, req.body.data);

            res.json(true);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async responses(req: express.Request, res: express.Response) {
        try {

            const responses: Response[] = await SurveyRouter.getSurveyService().responses(req.query.surveyId);

            res.json(responses);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async statistics(req: express.Request, res: express.Response) {
        try {

            const responses: Response[] = await SurveyRouter.getSurveyService().responses(req.query.surveyId);

            const statistics: any[] = await SurveyRouter.getStatisticsService().buildChartsForResponses(responses);

            res.json(statistics);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        try {

            const body: Survey = req.body;

            let survey: Survey = new Survey(
                body.completeText,
                body.cookieName,
                body.goNextPageAutomatic,
                body.identifier,
                body.pages.map((page, pageOrder) => new Page(
                    page.elements.map((element, elementOrder) => new Element(

                        element.choices ? element.choices.map((choice, choiceOrder) => new Choice(
                            choiceOrder,
                            typeof (choice) === 'string' ? choice : choice.text,
                            typeof (choice) === 'string' ? choice : choice.value,
                        )) : null,
                        element.choicesOrder,
                        element.description,
                        element.identifier,
                        element.inputType,
                        element.isRequired,
                        element.maxRateDescription,
                        element.minRateDescription,
                        element.name,
                        elementOrder,
                        element.placeHolder,
                        element.rateMax,
                        element.rateMin,
                        element.rateStep,
                        element.title,
                        element.type,
                    )),
                    page.identifier,
                    page.name,
                    pageOrder,
                )),
                null,
                body.showCompletedPage,
                body.showProgressBar,
                body.title,
            );

            survey = await SurveyRouter.getSurveyService().update(
                req.user.id,
                survey,
            );

            res.json(survey);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    protected static getStatisticsService(): StatisticsService {

        const statisticsService: StatisticsService = new StatisticsService();

        return statisticsService;
    }

    protected static getSurveyService(): SurveyService {

        const elementRepository: ElementRepository = new ElementRepository(config.database.host, config.database.username, config.database.password);
        const pageyRepository: PageRepository = new PageRepository(config.database.host, config.database.username, config.database.password);
        const responseRepository: ResponseRepository = new ResponseRepository(config.database.host, config.database.username, config.database.password);
        const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

        const surveyService: SurveyService = new SurveyService(elementRepository, pageyRepository, responseRepository, surveyRepository);

        return surveyService;
    }
}
