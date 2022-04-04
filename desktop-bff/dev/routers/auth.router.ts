import Express from 'express'
import { register, login } from '../controllers/auth.controller'

export const authRouter = Express.Router()

authRouter.post('/auth/users', register)
authRouter.post('/auth/users/session', login)
