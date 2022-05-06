import { Request, Response, NextFunction } from 'express';
import { controller, get, requestPathLogger, use } from './decorators';

function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (req.session && req.session.loggedIn) {
        next();
        return;
    }

    res.status(403)
    res.send("Forbidden")
}


@controller('')
class RootController {
    @get('/')
    @use(requestPathLogger)
    getRoot(req: Request, res: Response): void {
        if (req.session && req.session.loggedIn) {
            res.send(`
            <div>
                <div>You are logged in.</div>
                <a href="/auth/logout">Logout</a>
            </div>
        `);
        } else {
            res.send(`
            <div>
                <div>You are not logged in.</div>
                <a href="/auth/login">Login</a>
            </div>
        `);
        }
    }

    @get('/protected')
    @use(requestPathLogger)
    @use(requireAuth)
    getProtected(req: Request, res: Response): void {
        res.send('Welcome to protected page.');
    }
}
