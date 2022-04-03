import Express from 'express'
import { register } from '../controllers/auth.controller'

export const authRouter = Express.Router()

authRouter.post('/auth/users', register)
