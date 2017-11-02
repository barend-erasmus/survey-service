// Imports
import { config } from './../config';

// Imports repositories
import { ISurveyRepository } from './../repositories/survey';

// Imports models
import { Answer } from './../entities/answer';
import { Question } from './../entities/question';
import { Survey } from './../entities/survey';

export class SurveyService {

    constructor(private surveyRepository: ISurveyRepository) {

    }

    public async list(profileId: string): Promise<Survey[]> {
        return this.surveyRepository.list(profileId);
    }

    public async find(profileId: string, surveyId: number): Promise<Survey> {
        const survey: Survey = await this.surveyRepository.find(surveyId);

        if (survey.profileId !== profileId) {
            throw new Error('');
        }

        return survey;
    }

    public async create(
        profileId: string,
        title: string,
        questions: Question[],
    ): Promise<Survey> {

        let survey = new Survey(null, profileId, title, questions, false);

        survey = await this.surveyRepository.create(survey);

        return survey;
    }

    public async update(
        profileId: string,
        id: number,
        title: string,
        questions: Question[],
    ): Promise<Survey> {

        let survey = new Survey(id, profileId, title, questions, false);

        survey = await this.surveyRepository.update(survey);

        return survey;
    }

    public async saveAnswer(
        questionId: number,
        profileId: string,
        textValues: string[],
        numericValue: number,
    ): Promise<boolean> {
        const answer: Answer = new Answer(questionId, profileId, textValues, numericValue);

        return this.surveyRepository.saveAnswer(answer);
    }

    public async listAnswers(
        profileId: string,
        surveyId: number,
        questionId: number,
    ): Promise<Answer[]> {

        const survey: Survey = await this.surveyRepository.find(surveyId);

        if (survey.profileId !== profileId) {
            throw new Error('');
        }

        const question: Question = survey.questions.find((x) => x.id === questionId);

        if (!question) {
            throw new Error('');
        }

        return this.surveyRepository.listAnswers(questionId);
    }
}
