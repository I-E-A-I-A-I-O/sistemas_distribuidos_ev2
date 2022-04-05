import express from 'express'
import { createDog } from '../controllers/crud.controller'
import { verifyToken } from '../helpers/jwt.middleware'

export const crudRouter = express.Router()

crudRouter.post('/dogs', verifyToken, createDog)