import DBlocal from 'db-local'
import { validateUser, validateUpdate} from './schemas/user'

export class UserDB {
    static create( {username, password} ) {
        // validate user first
        validateUser({username, password})

    }
} 