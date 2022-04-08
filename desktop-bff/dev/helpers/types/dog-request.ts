import { z } from 'zod'

export const Dog = z.object({
    name: z.string().min(1),
    age: z.number().int(),
    breed: z.string()
})