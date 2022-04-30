import { Collection } from './models/Collection';
import { User, UserProps } from './models/User';
import { UserList } from './views/UserList';

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

