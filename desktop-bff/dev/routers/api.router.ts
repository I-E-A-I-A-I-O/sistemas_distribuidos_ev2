import Express from 'express'
import { create, read, patch, deleteDog } from '../controllers/api.controller'

export const apiRouter = Express.Router()

apiRouter.post('/api/dogs', create)
apiRouter.get('/api/dogs', read)
apiRouter.get('/api/dogs/:dogID', read)
apiRouter.patch('/api/dogs/:dogID', patch)
apiRouter.delete('/api/dogs/:dogID', deleteDog)
