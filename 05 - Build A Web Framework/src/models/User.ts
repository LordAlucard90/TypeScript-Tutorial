import { Attributes } from './Attributes';
import { Eventing } from './Eventing';
import { Model, HasId } from './Model';
import { ApiSync } from './ApiSync';
import { Collection } from './Collection';

const usersUrl = 'http://localhost:3000/users';

export interface UserProps extends HasId {
    id?: number;
    name?: string;
    age?: number;
}

export class User extends Model<UserProps> {
    static buildUser(data: UserProps) {
        return new User(
            new Attributes<UserProps>(data),
            new Eventing(),
            new ApiSync<UserProps>(usersUrl),
        );
    }

    static buildUserCollection(): Collection<User, UserProps> {
        return new Collection<User, UserProps>(usersUrl, (json: UserProps) => User.buildUser(json));
    }

    // new custom logic valid only for the user
    get isAdminUser(): boolean {
        return this.get('id') === 1;
    }

    setRandomAge(): void {
        const age = Math.round(Math.random() * 100);
        this.set({ age });
    }
}
