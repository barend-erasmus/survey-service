// Imports
import { ISurveyRepository } from './../survey';
import { BaseRepository } from './base';

// Imports models
import { Survey } from './../../entities/survey';

export class SurveyRepository extends BaseRepository implements ISurveyRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(profileId: string, survey: Survey): Promise<Survey> {

        await BaseRepository.models.Surveys.create({

        });

        return survey;
    }

    public async find(profileId: string, surveyId): Promise<Survey> {
        return null;
    }

    public async list(profileId: string): Promise<Survey[]> {
        const surveys: any[] = await BaseRepository.models.Surveys.findAll({
            where: {
                profileId,
            },
        });

        return null;
    }
}
