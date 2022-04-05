import { z } from 'zod'

export const Dog = z.object({
    name: z.string().min(1),
    age: z.number().int(),
    breed: z.string()
})

const DogDB = z.object({
    dog_id: z.string().uuid(),
    dog_name: z.string(),
    dog_age: z.number().int(),
    dog_owner: z.string().uuid()
})

export type DogDB = z.infer<typeof DogDB>
