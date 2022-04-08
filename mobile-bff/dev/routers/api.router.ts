import Express from 'express'
import { registerDog } from '../controllers/api.controller'

export const apiRouter = Express.Router()

apiRouter.post('/api/dogs', registerDog)
