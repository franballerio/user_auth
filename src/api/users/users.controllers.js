import { validateLogin, validateRegister } from './users.schemas.js'

export class Controller {

    constructor({ model }) {
        this.model = model
    }

    users = async (req, res) => {
        
        const users = await this.model.users()
        return res.json(users)
    }

    register = async (req, res) => {
        const { email, user_name, password } = req.body

        // validate user first
        const validUser = validateRegister({ email, user_name, password })

        if (validUser.success) {
            try {
                // the db manager creates the user and returns it
                const newUser = await this.model.create({ email, user_name, password })
                console.log(`User created id: ${newUser._id}`)
                res.json(newUser)
            } catch (error) {
                return res
                          .status(400)
                          .send(error.message)
            }
        } else {
            return res.send(validUser.error)
        }
    }

    login = async (req, res) => {
        const { userORemail, password } = req.body

        const validUser = validateLogin({ userORemail, password })

        if (validUser.success) {
            try {
                const user = await this.model.login({ userORemail, password })
                // create a jwtoken for session auth
                const token = jwt.sign(
                { id: user.id, email: user.email, user_name: user.user_name },
                JWT_SECRET,
                { expiresIn: '1h' }
                )
                console.log('User validated')
                res
                    // send the token to the client so it can resend it for auth
                    .cookie('access_cookie', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 1000 * 60 * 60
                    })
                    .json(user)
            } catch (error) {
                res.status(401).send(error.message)
            }
        } else {
            throw new Error('Invalid credentials')
        }
    }

    logout = (req, res) => {
        res
            .clearCookie('access_cookie')
            .json({message: 'Logout Successful'})
    }

    clear = (req, res) => {
        this.model.clear()
        res.send(200)
    }
}