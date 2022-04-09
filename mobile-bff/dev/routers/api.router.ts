import Express from 'express'
import { read, registerDog, patch, deleteDog } from '../controllers/api.controller'

export const apiRouter = Express.Router()

apiRouter.post('/api/dogs', registerDog)
apiRouter.get('/api/dogs', read)
apiRouter.get('/api/dogs/:dogID', read)
apiRouter.patch('/api/dogs/:dogID', patch)
apiRouter.delete('/api/dogs/:dogID', deleteDog)
