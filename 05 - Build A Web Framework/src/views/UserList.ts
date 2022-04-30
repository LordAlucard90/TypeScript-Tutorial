import { User, UserProps } from '../models/User';
import { CollectionView } from './CollectionView';
import { UserEdit } from './UserEdit';

export class UserList extends CollectionView<User, UserProps> {
    renderItem(model: User, itemParent: Element): void {
        // new UserShow(itemParent, model).render();
        new UserEdit(itemParent, model).render();
    }
}
