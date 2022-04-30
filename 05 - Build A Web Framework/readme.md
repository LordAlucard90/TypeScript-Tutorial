# Build A Web Framework

## Content

- [Setup](#setup)
- [Event Listening](#event-listening)
- [Json Server](#json-server)
- [Single Responsibility Components](#single-responsibility-components)
- [Generalize The Model](#generalize-the-model)
- [Model Collection](#model-collection)
- [The View](#the-view)
- [Event Handling](#event-handling)
- [Reusable View](#reusable-view)

---

## Setup

For this project will be used `parcel`:
```bash
sudo npm i -g parcel-bundler
parcel index.html 
```
with the base configuration:
```html
<html>
    <body>
        <script src="./src/index.ts"></script>
    </body>
</html>
```
```typescript
console.log("hello")
```

## Event Listening

The first part of the fremwork is the User model,
in order to inform the system about model changes can be added a callback 
mechanism:
```typescript
interface UserProps {
    name?: string;
    age?: number;
}

type Callback = () => void;

class User {
    events: { [key: string]: Callback[] } = {};

    constructor(private data: UserProps) {}

    get(propName: string): number | string {
        return this.data[propName];
    }

    set(update: UserProps): void {
        Object.assign(this.data, update);
    }

    on(eventName: string, callback: Callback): void {
        // dynamic array creation
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    }

    trigger(eventName: string): void {
        const handlers = this.events[eventName];

        if (!handlers || handlers.length === 0) {
            return;
        }

        handlers.forEach(callback => {
            callback();
        });
    }
}
```
the callback mechanism can be used in this way:
```typescript
const user = new User({
    name: 'Pippo',
    age: 42,
});

user.on('change', () => {
    console.log('Change callback!');
});
user.trigger('change');
```

## Json Server

Next step is to instal a [json-server](https://github.com/typicode/json-server)
in order to load and store data locally:
```bash
sudo npm i -g json-server
```
to make it work must be created a `db.json`
```json
{
    "users": []
}
```
now the server can be run in a separate terminal using
```bash
json-server -w db.json
```
it will be run a server with the following endopints:
- **GET**: `http://localhost:3000/users`
- **GET**: `http://localhost:3000/users/<id>`
- **POST**: `http://localhost:3000/users`
- **PUT**: `http://localhost:3000/users/<id>`
- **DELETE**: `http://localhost:3000/users/<id>`
now can be installed axios
```bash
npm i axios
```
and created a first user:
```typescript
const usersUrl = "http://localhost:3000/users"
axios.post(usersUrl, {
    name: 'Pippo',
    age: 42,
})
```
in the `db.json` has be created a new user with an unique id:
```json
{
    "users": [
        {
          "name": "Pippo",
          "age": 42,
          "id": 1
        }
    ]
}
```
now it is possible to add the fetch and save logic to the user model:
```typescript
const usersUrl = 'http://localhost:3000/users';

interface UserProps {
    id?: number;
    name?: string;
    age?: number;
}

type Callback = () => void;

class User {
    events: { [key: string]: Callback[] } = {};

    constructor(private data: UserProps) {}

    get(propName: string): number | string {
        return this.data[propName];
    }

    set(update: UserProps): void {
        Object.assign(this.data, update);
    }

    on(eventName: string, callback: Callback): void {
        // dynamic array creation
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    }

    trigger(eventName: string): void {
        const handlers = this.events[eventName];

        if (!handlers || handlers.length === 0) {
            return;
        }

        handlers.forEach(callback => {
            callback();
        });
    }

    fetch(): void {
        axios.get(`${usersUrl}/${this.get('id')}`).then((response: AxiosResponse) => {
            this.set(response.data);
        });
    }

    save(): void {
        const id = this.get('id')

        if (id) {
            axios.put(`${usersUrl}/${id}`, this.data);
        } else {
            axios.post(usersUrl, this.data);
        }
    }
}
```
and used it in the main code:
```typescript
const newUser = new User({
    name: 'Pippo',
    age: 42,
});
newUser.save();

const oldUser = new User({ id: 1 });
oldUser.fetch();
setTimeout(() => {
    oldUser.set({
        name: 'Pluto',
        age: 7,
    });
    oldUser.save();
}, 2000);
```
## Single Responsibility Components

It is possible to identify and extract the key features of the user
in different components:
- events
- storage
- attributes

### Events

There are three possible ways to compose a class responsible for the events:
- Add a new constructor parameter:\
```typescript
class User {
    constructor(private data: UserProps, private events: Eventing) {}

    //...
}

// too verbose
const user = new User({}, new Eventing())
```
- Add a factory method:\
```typescript
class User {
    private data: UserProps;

    static createUser(data: UserProps){
        const user = new User(new Eventing()); 
        user.set(data)
        return user;
    }

    constructor(, private events: Eventing ) {}

    //...
}

// unclear what is going on
const user = User.createUser({})
```
- Add a new class property:\
```typescript
class User {
    events: Eventing = new Eventing();

    //...
}

const user = new User({})
user.events.on("change", () => {})
user.events.trigger("change")
```
the last option is the most reasonable because it straightforward and
it is hard to have a different event management. 

The final Eventing class is:
```typescript
type Callback = () => void;

class Eventing {
    events: { [key: string]: Callback[] } = {};

    on(eventName: string, callback: Callback): void {
        // dynamic array creation
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    }

    trigger(eventName: string): void {
        const handlers = this.events[eventName];

        if (!handlers || handlers.length === 0) {
            return;
        }

        handlers.forEach(callback => {
            callback();
        });
    }
}
```

### Storage

While the events had no connection with the user, 
the storage operations (fetch / save) has a direct dependency with the 
User class, therefore the user needs to delefate its operations to the composed
Sync class.

The three possible solution to this problem are:
- Use function arguments\
```typescript
class Sync {
    save(id: number, data: UserProps): void {/* ... */}

    fetch(id: number): UserProps) {/* ... */}
}

class User {
    sync: Sync = new Sync();
    
    //...

    save(): void {
        this.sync.save(this.get("id"), this.data);
    }

    fetch(): void) {
        this.data = this.sync.fetch(this.get("id"));
    }
}

// the user and Sync classes are highly coupled, Sync is designed to only work with UserProps
```
- Introduce Serializable and Deserializable interfaces\
```typescript
interface Serializable {
    serialize(): {}
}

interface Deserializable {
    deserialize(json: {}): void
}

class Sync {
    save(id: number, serialize: Serializable): void {/* ... */}

    fetch(id: number): deserialize: Deserializable) {/* ... */}
}

class UserProps implements Serializable, Deserializable {
    // props definition
    // methos implementation
}

class User {
    sync: Sync = new Sync();
    
    //...

    save(): void {
        this.sync.save(this.get("id"), this.data);
    }

    fetch(): void) {
        this.data = this.sync.fetch(this.get("id"));
    }
}

// this approach is not really type safe because 
// it is needed to be used the {} (Object) type that is too general
```
- Use a generic specification\
```typescript
class Sync<T> {
    save(id: number, data: T): AxiosPromise<T> {/* ... */}

    fetch(id: number): AxiosPromise<T>) {/* ... */}
}

class User {
    sync: Sync = new Sync<UserProps>();
    
    //...

    save(): void {
        this.sync.save(this.get("id"), this.data);
    }

    fetch(): void) {
        this.sync.fetch(this.get("id")).then((data: UserProps) => {
            this.data = data;
        });
    }
}

// Generic and reusable solution
```
The last solution allows to reuse the sync mechanism for different data types.

The final Sync class is:
```typescript
export interface HasId {
    id?: number;
}

export class Sync<T extends HasId> {
    constructor(public rootUrl: string) {}

    fetch(id: number): AxiosPromise {
        return axios.get(`${this.rootUrl}/${id}`);
    }

    save(data: T): AxiosPromise {
        const { id } = data;

        if (id) {
            return axios.put(`${this.rootUrl}/${id}`, data);
        } else {
            return axios.post(this.rootUrl, data);
        }
    }
}
```

### Attributes

The last properties that can be extracted are the attributes:
```typescript
export class Attributes<T> {
    constructor(private data: T){}

    get<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }

    set(update: T): void {
        Object.assign(this.data, update);
    }
}
```

### User Delegation

At the end the User class will have to delegate its behaviour
to the nested classes:
```typescript
export interface UserProps extends HasId {
    id?: number;
    name?: string;
    age?: number;
}

const usersUrl = 'http://localhost:3000/users';

export class User {
    public events: Eventing = new Eventing();
    public sync: Sync<UserProps> = new Sync<UserProps>(usersUrl);
    public attributes: Attributes<UserProps>;

    constructor(data: UserProps) {
        this.attributes = new Attributes(data);
    }

    /*
     * Events
     */

    get on() {
        return this.events.on;
    }

    get trigger() {
        return this.events.trigger;
    }

    /*
     * Data
     */

    get get() {
        return this.attributes.get;
    }

    set(data: UserProps): void {
        this.attributes.set(data);
        this.events.trigger('change');
    }

    /*
     * Storage
     */

    fetch(): void {
        const id = this.get('id');

        if (typeof id !== 'number') {
            throw new Error('Cannot fetch without an id.');
        }
        this.sync.fetch(id).then((response: AxiosResponse): void => {
            this.set(response.data);
        });
    }

    save(): void {
        this.sync
            .save(this.attributes.getAll())
            .then((response: AxiosResponse): void => {
                this.set(response.data) // added to automatically update the id
                this.trigger('save');
            })
            .catch(() => {
                this.trigger('error');
            });
    }
}
```
in order to use this trik:
```typescript
get on() {
    return this.events.on;
}
```
the methods must be defined as arrow functions, otherwise the `this` reference breaks:
```typescript
export class Attributes<T> {
    // ...

    get = <K extends keyof T>(key: K): T[K] => {
        return this.data[key];
    };

    // used to make the save easier
    getAll = (): T => {
        return this.data;
    };
}
```
the main code is:
```typescript
const oldUser = new User({
    id: 1,
});
oldUser.on('change', () => {
    console.log(oldUser);
});
oldUser.fetch()

const newUser = new User({
    name: "Pluto",
    age: 7
});
newUser.on('save', () => {
    console.log(newUser);
});
newUser.save()
```

## Generalize The Model

Having a general model class helps to reuse the same logic for multiple models,
for example user posts in a blog a so on.

A model base class can be specified with the needed interfaces in this way:
```typescript
/*
 * Attributes
 */
export interface ModelAttributes<T> {
    get<K extends keyof T>(key: K): T[K];
    getAll(): T;
    set(update: T): void;
}

/*
 * Storage
 */
export interface HasId {
    id?: number;
}

export interface Sync<T extends HasId> {
    fetch(id: number): AxiosPromise;
    save(data: T): AxiosPromise;
}

/*
 * Events
 */
export type Callback = () => void;

export interface Events {
    on(eventName: string, callback: Callback): void;
    trigger(eventName: string): void;
}

/*
 * Model
 */
export interface HasId {
    id?: number;
}

export class Model<T extends HasId> {
    constructor(
        private attributes: ModelAttributes<T>,
        private events: Events,
        private sync: Sync<T>,
    ) {}

    /*
     * Events
     */

    // !! this works only if event is initialized as property in the constructor
    on = this.events.on; // equivalent to: get on() { return this.events.on; }

    // !! this works only if event is initialized as property in the constructor
    trigger = this.events.trigger; // equivalent to: get trigger() { return this.events.trigger; }

    /*
     * Data
     */

    // !! this works only if attributes is initialized as property in the constructor
    get = this.attributes.get; // equivalent to: get get() { return this.attributes.get; }

    set(data: T): void {
        this.attributes.set(data);
        this.events.trigger('change');
    }

    /*
     * Storage
     */

    fetch(): void {
        const id = this.get('id');

        if (typeof id !== 'number') {
            throw new Error('Cannot fetch without an id.');
        }
        this.sync.fetch(id).then((response: AxiosResponse): void => {
            this.set(response.data);
        });
    }

    save(): void {
        this.sync
            .save(this.attributes.getAll())
            .then((response: AxiosResponse): void => {
                this.set(response.data) // added to automatically update the id
                this.trigger('save');
            })
            .catch(() => {
                this.trigger('error');
            });
    }
}
```

the old classes now have to extend the new interfaces
```typescript
export class Eventing implements Events {
    // ...
}
export class Attributes<T> implements ModelAttributes<T> {
    // ...
}
// renamed Sync to ApiSync
export class ApiSync<T extends HasId> implements Sync<T> {
    // ...
}
```
The user model just become:
```typescript
export class User extends Model<UserProps> {
    static new(data: UserProps){
        return new User(new Attributes<UserProps>(data), new Eventing(), new ApiSync<UserProps>(usersUrl));
    }

    // new custom logic valid only for the user
    get isAdminUser(): boolean {
        return this.get("id") === 1;
    }
}
```
the main code becomes:
```typescript
const oldUser = User.buildUser({
    id: 1,
});
oldUser.on('change', () => {
    console.log(oldUser);
});
oldUser.fetch()

const newUser = User.buildUser({
    name: "Pluto",
    age: 7
});
newUser.on('save', () => {
    console.log(newUser);
});
newUser.save()
```

## Model Collection

It Cannot be known in advance all the ids of the user stored,
for this reason it is useful use the get all endpoint and store
all the users inside a collection:
```typescript
export class Collection<T, K> {
    models: T[] = [];
    events: Eventing = new Eventing();

    constructor(
        public rootUrl: string,
        public deserealize: (json: K) => T
    ) {}

    get on() {
        // shorter syntax not working in this case: on = this.events.on; // equivalent to:
        return this.events.on;
    }

    get trigger() {
        // shorter syntax not working in this case: trigger = this.events.trigger; // equivalent to:
        return this.events.trigger;
    }

    fetch(): void {
        axios.get(this.rootUrl).then((response: AxiosResponse) => {
            response.data.forEach((data: K) => {
                this.models.push(this.deserealize(data));
            });

            this.trigger('change');
        });
    }
}
```
Id is possible to add a static method inside the User class to create the collection:
```typescript
export class User extends Model<UserProps> {
    // ...
    static buildUserCollection(): Collection<User, UserProps> {
        return new Collection<User, UserProps>(usersUrl, (json: UserProps) => User.buildUser(json));
    }
}
```
and use in the main code:
```typescript
const userCollection = User.buildUserCollection();
userCollection.on('change', () => {
    console.log(userCollection.models);
});
userCollection.fetch();
```

## The View 

A view can be managed starting from a DOM element and using a render method
that add to this element the result of a template calculation:
```typescript
export class UserForm {
    constructor(public parent: Element) {}

    template(): string {
        return `
        <div>
            <h1>User Form</h1>
            <input />
        </div>
        `;
    }

    render(): void {
        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.template();

        this.parent.append(templateElement.content);
    }
}
```
in the main HTML file must be added a `root` element:
```html
<html>
    <body>
        <div id="root"></div>
        <script src="./src/index.ts"></script>
    </body>
</html>
```
and in the `index.ts` becomes:
```typescript
const userForm = new UserForm(document.getElementById('root'));
userForm.render();
```

### Attach Model To The View

The user model can be simply added user model as constructor parameter
and using it in the template:
```typescript
export class UserForm {
    constructor(public parent: Element, public model: User) {}

    // ...

    template(): string {
        return `
        <div>
            <h1>User Form</h1>
            <div>User Name: ${this.model.get('name')}</div>
            <div>User Age: ${this.model.get('age')}</div>
            <input />
            <button>Click Me</button>
        </div>
        `;
    }

    // ...
}
```

## Event Handling

The event Handling is done using a events maps the contains as keys the event
on which react and the element on which listen for the event and the hanfler
to trigger:
```typescript
eventsMap(): { [key: string]: () => void } {
    return {
        'click:button': this.onButtonClick,
    };
}
```
and a function that is able to find the DOM elements in the remplate and 
attach the methods:
```typescript
bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();

    for (let eventKey in eventsMap) {
        const [eventName, selector] = eventKey.split(':');

        fragment.querySelectorAll(selector).forEach(element => {
            element.addEventListener(eventName, eventsMap[eventKey]);
        });
    }
}
```
in the end the full view becomes:
```typescript
export class UserForm {
    // ...

    eventsMap(): { [key: string]: () => void } {
        return {
            'click:button': this.onButtonClick,
        };
    }

    onButtonClick(): void {
        console.log('Clicked!');
    }

    // ...

    bindEvents(fragment: DocumentFragment): void {
        const eventsMap = this.eventsMap();

        for (let eventKey in eventsMap) {
            const [eventName, selector] = eventKey.split(':');

            fragment.querySelectorAll(selector).forEach(element => {
                element.addEventListener(eventName, eventsMap[eventKey]);
            });
        }
    }

    render(): void {
        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.template();

        this.bindEvents(templateElement.content);

        this.parent.append(templateElement.content);
    }
}
```

### Generate Random User Age And Re-Render The View

After the add of a random age generator to the User model:
```typescript
export class User extends Model<UserProps> {
    // ...

    setRandomAge(): void {
        const age = Math.round(Math.random() * 100);
        this.set({ age });
    }
}
```
it is possible to handle the model update as specified before:
```typescript
export class UserForm {
    // ...

    eventsMap(): { [key: string]: () => void } {
        return {
            'click:.set-age': this.onSetAgeClick,
        };
    }

    // !! needed an arrow function to do not loose the `this` reference
    onSetAgeClick = (): void => {
          this.model.setRandomAge()
    }

    // ...
}
```
to refresh the HTML we can attach to the Model's `change` event the render method,
but in order to avoid duplication of the template, is it neecessaty to 
reset the template before writing the new data:
```typescript
export class UserForm {
    constructor(public parent: Element, public model: User) {
        this.bindModel();
    }

    bindModel(): void {
        this.model.on('change', () => {
            this.render();
        });
    }
    
    // ...

    render(): void {
        this.parent.innerHTML = '';

        // ...
    }
}
```

### Setting A New User Name And Strict Null Checks

It is possible to take an user input and update the user name on button click
just doing:
```typescript
export class UserForm {
    // ...

    eventsMap(): { [key: string]: () => void } {
        return {
            'click:.set-age': this.onSetAgeClick,
            'click:.set-name': this.onSetNameClick,
        };
    }

    // !! needed an arrow function to do not loose the `this` reference
    onSetNameClick = () => {
        const input = this.parent.querySelector('input');
        const name = input.value;
        this.model.set({ name });
    };

    // ...
}
```
With the set method the change event is triggered and the view will update.
This time the value must be taken manually with:
```typescript
const input = this.parent.querySelector('input');
const name = input.value;
```
If a `tsconfig.json` file is generated with the `tsc --init` command, then
the `"strict": true` configuration is taken into account, and this means
that the input is defined as `Element | null`.\
Therefore in order to avoid errors must be used a type guard:
```typescript
if (input){
    const name = input.value;
    this.model.set({ name });
}
```
the same goes for the main code:
```typescript
const user = User.buildUser({
    name: 'PLACEHOLDER',
    age: 0,
});
const root = document.getElementById('root');
if (root) {
    const userForm = new UserForm(root, user);
    userForm.render();
}
```

### Save The Model:

the model can be saved adding a sinple event handling as before:
```typescript
export class UserForm {
    // ...

    eventsMap(): { [key: string]: () => void } {
        return {
            'click:.set-age': this.onSetAgeClick,
            'click:.set-name': this.onSetNameClick,
            'click:.save': this.onSaveClick,
        };
    }

    // ...

    // !! needed an arrow function to do not loose the `this` reference
    onSaveClick = (): void => {
        this.model.save();
    };

    // ...

    template(): string {
        return `
        <div>
            <h1>User Form</h1>
            <div>User Name: ${this.model.get('name')}</div>
            <div>User Age: ${this.model.get('age')}</div>
            <input placeholder="${this.model.get('name')}" />
            <button class="set-name">Change me</button>
            <button class="set-age">Set Random Age</button>
            <button class="save">Save</button>
        </div>
        `;
    }
}
```

## Reusable View

The generic View logic can be moved to a generic abstract base View class:
```typescript
export abstract class View<T extends Model<K>, K> {
    constructor(public parent: Element, public model: T) {
        this.bindModel();
    }

    abstract eventsMap(): { [key: string]: () => void };
    abstract template(): string;

    bindModel(): void {
        this.model.on('change', () => {
            this.render();
        });
    }

    bindEvents(fragment: DocumentFragment): void {
        const eventsMap = this.eventsMap();

        for (let eventKey in eventsMap) {
            const [eventName, selector] = eventKey.split(':');

            fragment.querySelectorAll(selector).forEach(element => {
                element.addEventListener(eventName, eventsMap[eventKey]);
            });
        }
    }

    render(): void {
        this.parent.innerHTML = '';

        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.template();

        this.bindEvents(templateElement.content);

        this.parent.append(templateElement.content);
    }
}
```
the UserForm becomes:
```typescript
export class UserForm extends View<User, UserProps> {
    eventsMap(): { [key: string]: () => void } {
        return {
            'click:.set-age': this.onSetAgeClick,
            'click:.set-name': this.onSetNameClick,
            'click:.save': this.onSaveClick,
        };
    }

    // !! needed an arrow function to do not loose the `this` reference
    onSetAgeClick = (): void => {
        this.model.setRandomAge();
    };

    // !! needed an arrow function to do not loose the `this` reference
    onSetNameClick = () => {
        const input = this.parent.querySelector('input');
        if (input) {
            const name = input.value;
            this.model.set({ name });
        }
    };

    template(): string {
        return `
        <div>
            <h1>User Form</h1>
            <div>User Name: ${this.model.get('name')}</div>
            <div>User Age: ${this.model.get('age')}</div>
            <input placeholder="${this.model.get('name')}" />
            <button class="set-name">Change me</button>
            <button class="set-age">Set Random Age</button>
            <button class="save">Save</button>
        </div>
        `;
    }
}
```

### Split The View

In a generic view can also be not necessary the `eventsMap`, therefore
can be provided a default implementation in the View class:
```typescript
eventsMap(): { [key: string]: () => void } {
    return {};
}
```
next step is adding a region management to assign to each region selector
an element and an optional `onRender` method that can be used by childer
class to render their nested components:
```typescript
regions: { [key: string]: Element } = {};

regionsMap(): { [key: string]: string } {
    return {};
}

onRender(): void {}

mapRegions(fragment: DocumentFragment): void {
    const regionsMap = this.regionsMap();

    for (let key in regionsMap) {
        const selector = regionsMap[key];
        const element = fragment.querySelector(selector);

        if (element) {
            this.regions[key] = element;
        }
    }
}

render(): void {
    this.parent.innerHTML = '';

    const templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();

    this.bindEvents(templateElement.content);
    this.mapRegions(templateElement.content);

    this.onRender()

    this.parent.append(templateElement.content);
}
```
in this way it is possible to create a new View where manage
the inner regions:
```typescript
export class UserEdit extends View<User, UserProps> {
    regionsMap(): { [key: string]: string } {
        return {
            userShow: '.user-show',
            userForm: '.user-form',
        };
    }

    onRender(): void {
        new UserShow(this.regions.userShow, this.model).render()
        new UserForm(this.regions.userForm, this.model).render()
    }

    template(): string {
        return `
        <div>
            <h1>User Form</h1>
            <div class="user-show"></div>
            <div class="user-form"></div>
        </div>
        `;
    }
}
```
there the UserShow is defined as:
```typescript
export class UserShow extends View<User, UserProps> {
    template(): string {
        return `
        <div>
            <h1>User Details</h1>
            <div>User Name: ${this.model.get('name')}</div>
            <div>User Age: ${this.model.get('age')}</div>
        </div>
        `;
    }
}
```

### Collection Of Views

Last step of the refactoring is to create a collection of View 
where is possible to re-rentder them automatically:
```typescript
export abstract class CollectionView<T, K> {
    constructor(public parent: Element, public collection: Collection<T, K>) {}

    abstract renderItem(model: T, itemParent: Element): void;

    render(): void {
        this.parent.innerHTML = '';

        const templateElement = document.createElement('template');

        for (let model of this.collection.models) {
            const itemParent = document.createElement('div');
            this.renderItem(model, itemParent);
            templateElement.content.append(itemParent);
        }

        this.parent.append(templateElement.content);
    }
}
```
Now it is possible to user this view collection in a real class:
```typescript
export class UserList extends CollectionView<User, UserProps> {
    renderItem(model: User, itemParent: Element): void {
        new UserShow(itemParent, model).render();
    }
}
```
the main becomes:
```typescript
const usersUrl = 'http://localhost:3000/users';

const users = new Collection(usersUrl, (json: UserProps) => {
    return User.buildUser(json);
});
const newUser = User.buildUser({
    name: 'NEW USER PLACEHOLDER',
    age: 0,
});
users.on('change', () => {
    const root = document.getElementById('root');
    if (root) {
        users.models.push(newUser);
        new UserList(root, users).render();
    }
});
users.fetch();

```

