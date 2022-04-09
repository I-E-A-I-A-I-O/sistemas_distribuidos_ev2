import express from 'express'
import { createDog, readDog, readDogs } from '../controllers/crud.controller'
import { verifyToken } from '../helpers/jwt.middleware'

export const crudRouter = express.Router()

crudRouter.post('/dogs', verifyToken, createDog)
crudRouter.get('/dogs', verifyToken, readDogs)
crudRouter.get('/dogs/:dogID', verifyToken, readDog)