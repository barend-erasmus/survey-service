// Imports
import { ISurveyRepository } from './../survey';
import { BaseRepository } from './base';

// Imports models
import { Survey } from './../../entities/survey';
import { Question } from './../../entities/question';

export class SurveyRepository extends BaseRepository implements ISurveyRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(profileId: string, survey: Survey): Promise<Survey> {

        const result: any = await BaseRepository.models.Surveys.create({
            profileId,
            title: survey.title,
            questions: survey.questions.map((x) => {
                return {
                    linearScaleMaximum: x.linearScaleMaximum,
                    linearScaleMinimum: x.linearScaleMinimum,
                    text: x.text,
                    type: x.type,
                    options: x.options.map((y) => {
                        return {
                            text: y,
                        };
                    })
                };
            })
        }, {
                include: [
                    {
                        model: BaseRepository.models.Questions,
                        include: [
                            { model: BaseRepository.models.Options }
                        ]
                    },
                ],
            });

        survey.id = result.id;

        const questions: any[] = await BaseRepository.models.Questions.findAll({
            include: [
                { model: BaseRepository.models.Options }
            ],
            where: {
                surveyId: survey.id,
            },
        });

        survey.questions = questions.map((x) => new Question(
            x.id,
            x.text,
            x.type,
            x.options.map((y) => y.text),
            x.linearScaleMinimum,
            x.linearScaleMaximum,
        ));

        return survey;
    }

    public async find(profileId: string, surveyId: number): Promise<Survey> {
        const survey: any = await BaseRepository.models.Surveys.find({
            include: [
                {
                    include: [
                        { model: BaseRepository.models.Options }
                    ],
                    model: BaseRepository.models.Questions
                }
            ],
            where: {
                id: surveyId,
                profileId,
            },
        });

        if (!survey) {
            return null;
        }

        return new Survey(
            survey.id,
            survey.title,
            survey.questions.map((x) => new Question(
                x.id,
                x.text,
                x.type,
                x.options.map((y) => y.text),
                parseInt(x.linearScaleMinimum), 
                parseInt(x.linearScaleMaximum),
            ))
        );
    }

    public async list(profileId: string): Promise<Survey[]> {
        const surveys: any[] = await BaseRepository.models.Surveys.findAll({
            where: {
                profileId,
            },
        });

        return surveys.map((x) => new Survey(
            x.id,
            x.title,
            [],
        ));
    }
}
