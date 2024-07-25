import * as z from 'zod'

export const CategorySchema = z.object({
  title:z.string(),
})