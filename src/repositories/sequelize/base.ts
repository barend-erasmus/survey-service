// Imports
import * as Sequelize from 'sequelize';

export class BaseRepository {
    protected static sequelize: Sequelize.Sequelize = null;
    protected static models: {
        Surveys: Sequelize.Model<{}, {}>,
        Questions: Sequelize.Model<{}, {}>,
        Options: Sequelize.Model<{}, {}>,
    } = null;

    private static defineModels(): void {
        const Surveys = BaseRepository.sequelize.define('surveys', {
            profileId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Questions = BaseRepository.sequelize.define('questions', {
            linearScaleMaximum: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            linearScaleMinimum: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            text: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Options = BaseRepository.sequelize.define('options', {
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        Surveys.hasMany(Questions, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Questions.belongsTo(Surveys, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Questions.hasMany(Options, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Options.belongsTo(Questions, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        this.models = {
            Options,
            Questions,
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

    public sync(): Promise<void> {
        return new Promise((resolve, reject) => {
            BaseRepository.sequelize.sync({ force: true }).then(() => {
                resolve();
            });
        });
    }

    public close(): void {
        BaseRepository.sequelize.close();
    }
}
