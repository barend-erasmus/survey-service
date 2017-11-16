// Imports
import * as Sequelize from 'sequelize';

export class BaseRepository {
    protected static sequelize: Sequelize.Sequelize = null;
    protected static models: {
        Choices: Sequelize.Model<{}, {}>,
        Elements: Sequelize.Model<{}, {}>,
        Pages: Sequelize.Model<{}, {}>,
        Surveys: Sequelize.Model<{}, {}>,
    } = null;

    private static defineModels(): void {
        const Surveys = BaseRepository.sequelize.define('surveys', {
            title: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            profileId: {
                allowNull: false,
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
            description: {
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
            title: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            maxRateDescription: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            minRateDescription: {
                allowNull: true,
                type: Sequelize.STRING,
            },
        });

        const Choices = BaseRepository.sequelize.define('choices', {
            value: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            order: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            text: {
                allowNull: true,
                type: Sequelize.STRING,
            },
        });


        Surveys.hasMany(Pages, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Pages.belongsTo(Surveys, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Pages.hasMany(Elements, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Elements.belongsTo(Pages, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Elements.hasMany(Choices, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Choices.belongsTo(Elements, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        this.models = {
            Choices,
            Elements,
            Pages,
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
