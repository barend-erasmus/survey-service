import { expect } from 'chai';
import 'mocha';

// Imports repositories
import { SurveyRepository } from './../repositories/memory/survey';

// Imports services
import { SurveyService } from './survey';

// Imports models
import { Survey } from './../entities/survey';
import { Question } from './../entities/question';

describe('SurveyService', () => {
    describe('create', () => {
        it('should return survey', async () => {
            const surveyService: SurveyService = new SurveyService(new SurveyRepository());

            const survey: Survey = await surveyService.create('profile-id', 'title', [
                new Question(null, 'question-1', 'type', ['option-1'], null, null),
            ]);

            expect(survey).to.be.not.null;
            expect(survey.id).to.be.not.null;
            expect(survey.questions.length).to.be.eq(1);
            expect(survey.questions[0].id).to.be.not.null;
        });
    });

    describe('find', () => {
        it('should return survey', async () => {
            const surveyService: SurveyService = new SurveyService(new SurveyRepository());

            let survey: Survey = await surveyService.create('profile-id', 'title', [
                new Question(null, 'question-1', 'type', ['option-1'], null, null),
            ]);

            survey = await surveyService.find('profile-id', survey.id);

            expect(survey).to.be.not.null;
        });

        it('should throw error given other profile id', async () => {
            const surveyService: SurveyService = new SurveyService(new SurveyRepository());

            try {
                let survey: Survey = await surveyService.create('profile-id', 'title', [
                    new Question(null, 'question-1', 'type', ['option-1'], null, null),
                ]);

                survey = await surveyService.find('other-profile-id', survey.id);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Invalid Profile Id');
            }
        });
    });

    describe('list', () => {
        it('should return list of survey', async () => {
            const surveyService: SurveyService = new SurveyService(new SurveyRepository());

            await surveyService.create('profile-id', 'title', [
                new Question(null, 'question-1', 'type', ['option-1'], null, null),
            ]);

            await surveyService.create('profile-id', 'title', [
                new Question(null, 'question-1', 'type', ['option-1'], null, null),
            ]);

            await surveyService.create('profile-id', 'title', [
                new Question(null, 'question-1', 'type', ['option-1'], null, null),
            ]);

            const result: Survey[] = await surveyService.list('profile-id');

            expect(result.length).to.be.eq(3);
        });

        it('should return list of survey excluding surveys from other profiles', async () => {
            const surveyService: SurveyService = new SurveyService(new SurveyRepository());

            await surveyService.create('profile-id', 'title', [
                new Question(null, 'question-1', 'type', ['option-1'], null, null),
            ]);

            await surveyService.create('profile-id', 'title', [
                new Question(null, 'question-1', 'type', ['option-1'], null, null),
            ]);

            await surveyService.create('other-profile-id', 'title', [
                new Question(null, 'question-1', 'type', ['option-1'], null, null),
            ]);

            const result: Survey[] = await surveyService.list('profile-id');

            expect(result.length).to.be.eq(2);
        });
    });
});