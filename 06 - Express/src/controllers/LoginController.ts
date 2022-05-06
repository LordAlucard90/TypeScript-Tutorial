import { NextFunction, Request, RequestHandler, Response } from 'express';
import { controller, get, post, use, requestPathLogger, bodyValidator } from './decorators';

@controller('/auth')
export class LoginController {
    @get('/login')
    @use(requestPathLogger)
    getLogin(req: Request, res: Response): void {
        res.send(`
        <form method="POST">
            <div>
                <label>Email</label>
                <input name="email">
            </div>
            <div>
                <label>Password</label>
                <input name="password" type="password">
            </div>
            <button>Submit</button>
        </form>
    `);
    }

    @post('/login')
    @use(requestPathLogger)
    @bodyValidator('email', 'password')
    postLogin(req: Request, res: Response): void {
        const { email, password } = req.body;

        if (email && password && email === 'email@example.com' && password === 'password') {
            req.session = { loggedIn: true };
            res.redirect('/');
        } else {
            res.send('Invalid email or password.');
        }
    }

    @get('/logout')
    getLogout(req: Request, res: Response): void {
        req.session = undefined;
        res.redirect('/');
    }
}
