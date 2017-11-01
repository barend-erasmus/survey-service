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

    public async create(survey: Survey): Promise<Survey> {

        const result: any = await BaseRepository.models.Surveys.create({
            profileId: survey.profileId,
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

    public async update(survey: Survey): Promise<Survey> {

        const existingSurvey: Survey = await this.find(survey.id);

        for (const question of existingSurvey.questions) {
            for (const option of question.options) {
                await BaseRepository.models.Options.destroy({
                    where: {
                        questionId: question.id,
                        text: option,
                    }
                });
            }

            await BaseRepository.models.Questions.destroy({
                where: {
                    id: question.id,
                    surveyId: existingSurvey.id,
                }
            });
        }

        await BaseRepository.models.Surveys.update({
            title: survey.title,
        },
            {
                where: {
                    id: survey.id
                }
            });


        for (const question of survey.questions) {
            await BaseRepository.models.Questions.create({
                linearScaleMaximum: question.linearScaleMaximum,
                linearScaleMinimum: question.linearScaleMinimum,
                text: question.text,
                type: question.type,
                options: question.options.map((y) => {
                    return {
                        text: y,
                    };
                })
            }, {
                    include: [
                        { model: BaseRepository.models.Options }
                    ]
                });
        }


        survey = await this.find(survey.id);

        return survey;
    }

    public async find(surveyId: number): Promise<Survey> {
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
            },
        });

        if (!survey) {
            return null;
        }

        return new Survey(
            survey.id,
            survey.profileId,
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
            include: [
                {
                    include: [
                        { model: BaseRepository.models.Options }
                    ],
                    model: BaseRepository.models.Questions
                }
            ],
            where: {
                profileId,
            },
        });

        return surveys.map((x) => new Survey(
            x.id,
            x.profileId,
            x.title,
            x.questions.map((y) => new Question(
                y.id,
                y.text,
                y.type,
                y.options.map((z) => z.text),
                parseInt(y.linearScaleMinimum),
                parseInt(y.linearScaleMaximum),
            ))
        ));
    }
}
