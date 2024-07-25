import * as z from 'zod'

export const ProductSchema = z.object({
  title:z.string(),
  description:z.string(),
  prices:z.number(),
  category:z.object({
    title:z.string(),
  }),
  img:z.string(),
})
