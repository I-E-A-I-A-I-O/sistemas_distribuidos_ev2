import Express from 'express'
import { registerDog, read } from '../controllers/api.controller'

export const apiRouter = Express.Router()

apiRouter.post('/api/dogs', registerDog)
apiRouter.get('/api/dogs', read)
apiRouter.get('/api/dogs/:dogID', read)
