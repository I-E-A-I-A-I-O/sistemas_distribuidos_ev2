import Express from 'express'
import { register, login } from '../controllers/auth.controller'

export const authRouter = Express.Router()

authRouter.post('/users', register)
authRouter.post('/users/session', login)
