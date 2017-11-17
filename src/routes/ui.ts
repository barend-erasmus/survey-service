// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { ElementRepository } from './../repositories/sequelize/element';
import { PageRepository } from './../repositories/sequelize/page';
import { SurveyRepository } from './../repositories/sequelize/survey';

// Imports services
import { SurveyService } from './../services/survey';

// Imports models
import { Survey } from './../entities/survey';

export class UIRouter {

    public static async surveyList(req: express.Request, res: express.Response) {
        const surveys: Survey[] = await UIRouter.getSurveyService().list(req.user.id);

        res.render('survey/list', {
            surveys,
            user: req.user,
        });
    }

    public static async surveyCreate(req: express.Request, res: express.Response) {
        res.render('survey/create', {});
    }

    public static async surveyEdit(req: express.Request, res: express.Response) {
        res.render('survey/edit', {});
    }

    public static async survey(req: express.Request, res: express.Response) {
        res.render('survey', {
            layout: false,
        });
    }

    protected static getSurveyService(): SurveyService {

        const elementRepository: ElementRepository = new ElementRepository(config.database.host, config.database.username, config.database.password);
        const pageyRepository: PageRepository = new PageRepository(config.database.host, config.database.username, config.database.password);
        const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

        const surveyService: SurveyService = new SurveyService(elementRepository, pageyRepository, surveyRepository);

        return surveyService;
    }
}
