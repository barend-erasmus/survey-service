// Imports
import * as Sequelize from 'sequelize';

export class BaseRepository {
    protected static models: {
        Answers: Sequelize.Model<{}, {}>,
        Choices: Sequelize.Model<{}, {}>,
        Elements: Sequelize.Model<{}, {}>,
        Pages: Sequelize.Model<{}, {}>,
        Responses: Sequelize.Model<{}, {}>,
        Surveys: Sequelize.Model<{}, {}>,
    } = null;
    protected static sequelize: Sequelize.Sequelize = null;

    private static defineModels(): void {
        
        const Surveys = BaseRepository.sequelize.define('surveys', {
            completeText: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            cookieName: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            goNextPageAutomatic: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
            },
            profileId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            showCompletedPage: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
            },
            showProgressBar: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            title: {
                allowNull: true,
                type: Sequelize.STRING,
            },
        });

        const Pages = BaseRepository.sequelize.define('pages', {
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            order: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
        });

        const Elements = BaseRepository.sequelize.define('elements', {
            choicesOrder: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            description: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            inputType: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            isRequired: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
            },
            maxRateDescription: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            minRateDescription: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            order: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            placeHolder: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            rateMax: {
                allowNull: true,
                type: Sequelize.NUMERIC,
            },
            rateMin: {
                allowNull: true,
                type: Sequelize.NUMERIC,
            },
            rateStep: {
                allowNull: true,
                type: Sequelize.NUMERIC,
            },
            title: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Choices = BaseRepository.sequelize.define('choices', {
            order: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            text: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            value: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Responses = BaseRepository.sequelize.define('responses', {
            profileId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Answers = BaseRepository.sequelize.define('answers', {
            value: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        Surveys.hasMany(Pages, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Pages.belongsTo(Surveys, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Pages.hasMany(Elements, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Elements.belongsTo(Pages, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Elements.hasMany(Choices, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Choices.belongsTo(Elements, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Surveys.hasMany(Responses, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Responses.belongsTo(Surveys, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Responses.hasMany(Answers, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Answers.belongsTo(Responses, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Elements.hasMany(Answers, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Answers.belongsTo(Elements, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        this.models = {
            Answers,
            Choices,
            Elements,
            Pages,
            Responses,
            Surveys,
        };
    }

    constructor(private host: string, private username: string, private password: string) {

        if (!BaseRepository.sequelize) {
            BaseRepository.sequelize = new Sequelize('survey-service', username, password, {
                dialect: 'postgres',
                host,
                logging: false,
                pool: {
                    idle: 10000,
                    max: 5,
                    min: 0,
                },
            });

            BaseRepository.defineModels();
        }
    }

    public close(): void {
        BaseRepository.sequelize.close();
    }

    public sync(): Promise<void> {
        return new Promise((resolve, reject) => {
            BaseRepository.sequelize.sync({ force: true }).then(() => {
                resolve();
            });
        });
    }
}
