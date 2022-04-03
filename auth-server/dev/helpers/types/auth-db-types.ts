import { z } from 'zod'

const user = z.object({
    user_id: z.string().uuid(),
    user_role: z.enum(['admin', 'regular']),
    user_email: z.string().email(),
    user_password: z.string()
})

export type User = z.infer<typeof user>
