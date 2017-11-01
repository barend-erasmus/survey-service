// Imports
import { ISurveyRepository } from './../survey';

// Imports models
import { Answer } from './../../entities/answer';
import { Survey } from './../../entities/survey';

export class SurveyRepository implements ISurveyRepository {

    private surveys: Survey[] = [];

    public async create(survey: Survey): Promise<Survey> {
        survey.id = Math.floor(Math.random() * 1000);

        this.surveys.push(survey);

        return survey;
    }

    public async update(survey: Survey): Promise<Survey> {
        return survey;
    }

    public async find(surveyId: number): Promise<Survey> {
        return this.surveys.find((x) => x.id === surveyId);
    }

    public async list(profileId: string): Promise<Survey[]> {
        return this.surveys.filter((x) => x.profileId === profileId);
    }

    public async saveAnswer(answer: Answer): Promise<boolean> {
            return true;
    }

    public async listAnswers(questionId: number): Promise<Answer[]> {
        return [];
    }
}
