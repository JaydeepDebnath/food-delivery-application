import * as z from 'zod'

export const OrderSchema = z.object({
  customer:z.string(),
  address:z.string(),
  item:z.object({
    title:z.string(),
    description:z.string(),
    prices:z.number(),
    category:z.object({
      title:z.string(),
    }),
    img:z.string(),
  }),
  quantity:z.number(),
  status:z.boolean(),
  payment:z.object({
    amount:z.number(),
    method:z.enum(['CASH','CARD','UPI']),
    currency:z.string(),
    status:z.enum(['pending', 'completed', 'failed'])
  }),
  createdAt:z.date(),
});