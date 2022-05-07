# Express

## Content

- [Setup](#setup)
- [Routing](#routing)
- [Request Typification](#request-typification)
- [Login Process](#login-process)
- [Introducing Decorators And Metadata](#introducing-decorators-and-metadata)

---

## Setup

Like previously the configuration is:
```bash
npm init -y
tsc --init
npm i concurrently nodemon
```
set up on `tsconfig.json`:
```json
{
    // ...
    "rootDir": "./src",
    // ...
    "outDir": "./build",
    // ...
}
```

### Express Installation

Express can be installed easily with:
```bash
npm i express
# other packages that will be used
npm i body-parser cookie-session
# related types
npm i @types/express @types/body-parser @types/cookie-session
```

## Routing

It is possible to define a rout and start the server with:
```typescript
const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send(`
         <div>
            <h1>Hi there!</h1>
         </div>
             `);
});

app.listen(3000, () => {
    console.log('Listening on port 3000.');
});
```
the server can be started using
```bash
npm start
```
it is afterwards available at [http://localhost:3000/](http://localhost:3000/)

### Router

The previous code can be refactored using a Router in a separate:
```typescript
const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send(`
         <div>
            <h1>Hi there!</h1>
         </div>
             `);
});

export { router };
```
the main becomes:
```typescript
const app = express();

app.use(router);

app.listen(3000, () => {
    console.log('Listening on port 3000.');
});
```

## Request Typification

It is possible to parse the request bodies addd the body parser to the app:
```typescript
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.listen(3000, () => {
    console.log('Listening on port 3000.');
});
```
now it it possible to implement the login method as:
```typescript
const router = Router();

router.get('/login', (req: Request, res: Response) => {
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
});

router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    res.send(`Received login request for user ${email}, with password ${password}`);
});

export { router };
```
unfortunately typescript is not aware of the body structure, 
and if `app.use(bodyParser.urlencoded({ extended: true }));` is removed,
it will give a runtime error.\
In oder to improve this behaviour is possible to add a custom type:
```typescript
router.get('/login', (req: Request, res: Response) => {
    // ...
});

router.post('/login', (req: RequestWithBody, res: Response) => {
    const { email, password } = req.body;

    if (email) {
        res.send(
            `Received login request for user ${email.toUpperCase()}, with password ${password}`,
        );
    } else {
        res.send("An email must be provided.")
    }
});
```

## Login Process

The login process can be managed useing the cookie session:
```typescript
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({keys: ['encodingKey']}))
app.use(router);

app.listen(3000, () => {
    console.log('Listening on port 3000.');
});
```
and in the controller:
```typescript
router.post('/login', (req: RequestWithBody, res: Response) => {
    const { email, password } = req.body;

    if (email && password && email === 'email@example.com' && password === 'password') {
        req.session = { loggedIn: true };
        res.redirect('/');
    } else {
        res.send('Invalid email or password.');
    }
});
```

### Check Login Status

In the main route the login status can be easily checked with:
```typescript
router.get('/', (req: Request, res: Response) => {
    if(req.session && req.session.loggedIn){
        res.send(`
            <div>
                <div>You are logged in.</div>
                <a href="/logout">Logout</a>
            </div>
        `)
    } else {
        res.send(`
            <div>
                <div>You are not logged in.</div>
                <a href="/login">Login</a>
            </div>
        `)
    }
});
```

### Logging Out

The logout is just:
```typescript
router.get('/logout', (req: Request, res: Response) => {
    req.session = undefined;
    res.redirect('/');
});
```

### Securing Pages Access

To automatically check the user stare can be create a function:
```typescript
function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (req.session && req.session.loggedIn) {
        next();
        return;
    }

    res.status(403)
    res.send("Forbidden")
}
```
now this function can be used in the route:
```typescript
router.get('/protected', requireAuth, (req: Request, res: Response) => {
    res.send("Welcome to protected page.")
});
```

## Introducing Decorators And Metadata

In oder to correctly work with metadata is it necessary to set the `target` to
`es5` while with `es2016` is not working correctly, and install the `reflect-metadata` 
package:
```bash
npm i reflect-metadata
```

```typescript
export class AppRouter {
    private static instance: express.Router;

    static getInstance(): express.Router {
        if (!AppRouter.instance) {
            AppRouter.instance = express.Router();
        }

        return AppRouter.instance;
    }
}
```

### Configuration

In order to avoid annoing typos and make the applicaiton work corrctly 
define enums is a good practice:
```typescript
export enum MetaDataKeys {
    method = 'method',
    path = 'path',
    middleware = 'middleware',
    validator = 'validator',
}

export enum Methods {
    get = 'get',
    post = 'post',
    put = 'put',
    patch = 'patch',
    del = 'delete',
}
```

### Rest Methods Annotation

The different request method can annotations can be defined as:
```typescript
// ensure the annotated method is a valid RequestHandler
interface RouteHandlerDescriptor extends PropertyDescriptor {
    value?: RequestHandler
}

function routeBinder(method: string) {
    return function get(path: string) {
        return function (target: any, key: string, desc: RouteHandlerDescriptor) {
            Reflect.defineMetadata(MetadataKeys.path, path, target, key);
            Reflect.defineMetadata(MetadataKeys.method, method, target, key);
        };
    };
}

export const get = routeBinder(Methods.get);
export const put = routeBinder(Methods.put);
export const post = routeBinder(Methods.post);
export const del = routeBinder(Methods.del);
export const patch = routeBinder(Methods.patch);
```

### Middleware Annotation

The middleware is used to process a request and add some logic before 
processing it:
```typescript
export function use(middleware: RequestHandler) {
    return function (target: any, key: string, desc: PropertyDescriptor) {
        const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];

        Reflect.defineMetadata(MetadataKeys.middleware, [...middlewares, middleware], target, key);
    };
}
```
middleware implementations:
```typescript
export function requestPathLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method}: ${req.path}`);
    next();
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (req.session && req.session.loggedIn) {
        next();
        return;
    }

    res.status(403)
    res.send("Forbidden")
}
```

### Validator Annotation

A validator can be used to verify request data like the request body
```typescript
export function bodyValidator(...keys: string[]) {
    return function (target: any, key: string, desc: PropertyDescriptor) {
        Reflect.defineMetadata(MetadataKeys.validator, keys, target, key);
    };
}
```
the body validation is implemented in the controller annotation below.

### Controller Annotation

finally a controller annotation with all the mata data menagemetn behind is defined:
```typescript
function bodyValidator(keys: string): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.body) {
            res.status(422).send('Invalid Request');
            return;
        }

        for (let key of keys) {
            if (!req.body[key]) {
                res.status(422).send(`Missing property: ${key}`);
                return;
            }
        }

        next();
    };
}

export function controller(routePrefix: string) {
    return function (target: Function) {
        const router = AppRouter.getInstance();

        for (let key in target.prototype) {
            const routeHandler = target.prototype[key];
            const path = Reflect.getMetadata(MetadataKeys.path, target.prototype, key);
            const method: Methods = Reflect.getMetadata(MetadataKeys.method, target.prototype, key);
            const middlewares =
                Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) || [];
            const requiredBodyProps =
                Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) || [];

            const validator = bodyValidator(requiredBodyProps);

            if (path && method) {
                // this call does not give an error thank to Methods
                router[method](`${routePrefix}${path}`, ...middlewares, validator, routeHandler);
            }
        }
    };
}
```

### Controllers Definition

The controllers can now be refactored as:
```typescript
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
```

### App

With the new code the app now becomes:
```typescript
// this makes the routes load
import './controllers/LoginController'; 
import './controllers/RootController'; 

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({keys: ['encodingKey']}))
app.use(AppRouter.getInstance())

app.listen(3000, () => {
    console.log('Listening on port 3000.');
});
```

