import {z} from 'zod'

export const zodAddress = z.string().startsWith("0x").min(42).max(42)

export const erc20 = z.object({
  chainId: z.number({coerce: true}).min(1),
  address: zodAddress,
  name: z.string(),
  symbol: z.string().optional(),
  decimals: z.number().min(0).nullable().catch(_ => null),
  logoURI: z.string().url().optional(),
  extensions: z.object({
    link: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    ogImage: z.string().nullable().optional(),
    originChainId: z.number().min(1).optional(),
    originAddress: zodAddress.optional().nullable().catch(_ => null),
  }).optional()
})

export type ERC20 = z.infer<typeof erc20>

export const tokenList = z.object({
  name: z.string(),
  chainId: z.number().min(1),
  tokenStandard: z.enum(['erc20']),
  logoUri: z.string().url().optional(),
  keywords: z.array(z.string()),
  timestamp: z.string().datetime(),
  tokens: z.array(erc20)
})

export type TokenList = z.infer<typeof tokenList>
