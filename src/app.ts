// Imports
import * as express from 'express';
import * as path from 'path';
import * as request from 'request-promise';
import * as yargs from 'yargs';
import { config } from './config';

// Import Repositories
import { BaseRepository } from './repositories/sequelize/base';
import { SurveyRepository } from './repositories/sequelize/survey';

// Imports middleware
import * as bodyParser from 'body-parser';
import * as cookieSession from 'cookie-session';
import * as exphbs from 'express-handlebars';
import * as passport from 'passport';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as OAuth2Strategy from 'passport-oauth2';

// Imports routes
import { SurveyRouter } from './routes/survey';
import { UIRouter } from './routes/ui';

const surveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

const argv = yargs.argv;
const app = express();

// Configures session
app.use(cookieSession({
    keys: ['my-secret'],
    maxAge: 604800000, // 7 Days
    name: 'session',
}));

// Configures passport
app.use(passport.initialize());

passport.serializeUser((user: any, done: (err: Error, obj: any) => void) => {
    done(null, `${user.id}|${user.displayName}`);
});

passport.deserializeUser((id: string, done: (err: Error, obj: any) => void) => {
    done(null, {
        displayName: id.split('|')[1],
        id: id.split('|')[0],
    });
});

app.use(passport.session());

passport.use(new GoogleStrategy({
    callbackURL: argv.prod ? `https://survey-service.openservices.co.za/ui/callback` : 'http://localhost:3000/ui/callback',
    clientID: '747263281118-a6dpgtqjhscgapi88o7jqsv1ol1r67qv.apps.googleusercontent.com',
    clientSecret: 'TTOZj8hjYF4r6t0qua5Oz6Vm',
}, async (accessToken: string, refreshToken: string, profile: any, done: (err: Error, obj: any) => void) => {
    return done(null, profile);
}));

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/static', express.static(path.join(__dirname, 'public')));

// Configures view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        for: (from: number, to: number, incr: number, block: any) => {
            let accum = '';
            for (let i = from; i < to + 1; i += incr) {
                accum += block.fn(i);
            }
            return accum;
        },
        ifCond: (v1: any, v2: any, options) => {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },

    },
    layoutsDir: path.join(__dirname, 'views/layouts'),
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.get('/ui/login', passport.authenticate('google', {
    failureRedirect: '/',
    prompt: 'select_account',
    scope: ['profile'],
    session: true,
    successRedirect: '/ui/survey/list',
} as any));

app.get('/ui/callback', passport.authenticate('google', { failureRedirect: '/ui/login' }),
    (req: express.Request, res: express.Response) => {
        res.redirect(decodeURIComponent(req.query.state));
    });

function requireUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.user) {
        const options: any = {

            failureRedirect: '/',
            prompt: 'select_account',
            scope: ['profile'],
            session: true,
            state: encodeURIComponent(req.url),
            successRedirect: '/ui/survey/list',
        };

        passport.authenticate('google', options)(req, res, next);
        return;
    }

    next();
}

app.post('/api/survey/create', requireUser, SurveyRouter.create);
app.get('/api/survey/list', requireUser, SurveyRouter.list);
app.get('/api/survey/find', requireUser, SurveyRouter.find);

app.get('/ui/survey/list', requireUser, UIRouter.surveyList);
app.get('/ui/survey/create', requireUser, UIRouter.surveyCreate);
app.get('/ui/survey/edit', requireUser, UIRouter.surveyEdit);

app.get('/ui/logout', requireUser, (req: express.Request, res: express.Response) => {
    req.logout();
    res.send('Logged Out');
});

app.use('/api/docs', express.static(path.join(__dirname, './../apidoc')));
app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});

// surveyRepository.sync().then(() => {

// }).then((result) => {
//     console.log(result);
// });
