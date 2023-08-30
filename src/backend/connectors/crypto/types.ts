import {z} from 'zod'

export const zodAddress = z.string().startsWith("0x").min(42).max(42)

export type TokenBalance = {
  token: ERC20,
  balance: bigint,
  formatedBalance: () => number,
  price?: number,
  delta?: number,
}

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

const cmcResponseStatus = z.object({
  timestamp: z.date({coerce: true}),
  "error_code": z.number().min(0),
  "error_message": z.string().nullable(),
  elapsed: z.number(),
  "credit_count": z.number().min(0),
})

const cmcPriceInfo = z.object({
    "id": z.number(),
    "name": z.string(),
    "symbol": z.string(),
    "slug": z.string(),
    "is_active": z.number(),
    "is_fiat": z.number().nullable(),
    "circulating_supply": z.number(),
    "total_supply": z.number(),
    "max_supply": z.number().nullable(),
    "date_added": z.date({coerce: true}),
    "num_market_pairs": z.number(),
    "cmc_rank": z.number(),
    "last_updated": z.date({coerce: true}),
    "tags": z.array(z.union([z.string(), z.record(z.string(), z.any())])),
    "platform": z.object({
      id: z.number().min(0),
      name: z.string(),
      symbol: z.string(),
      slug: z.string(),
      token_address: z.string().startsWith('0x'),
    }).nullable(),
    "self_reported_circulating_supply": z.null(),
    "self_reported_market_cap": z.null(),
    "quote": z.record(z.string(), z.object({
        "price": z.number(),
        "volume_24h": z.number(),
        "volume_change_24h": z.number(),
        "percent_change_1h": z.number(),
        "percent_change_24h": z.number(),
        "percent_change_7d": z.number(),
        "percent_change_30d": z.number(),
        "market_cap": z.number(),
        "market_cap_dominance": z.number(),
        "fully_diluted_market_cap": z.number(),
        "last_updated": z.date({coerce: true})
    }))
})

export type CmcPriceInfo = z.infer<typeof cmcPriceInfo>

export const cmcPriceReturn = z.object({
  status: cmcResponseStatus,
  data: z.record(z.string(),
    z.union([cmcPriceInfo, z.array(cmcPriceInfo)])
  )
})

export type CmcPriceReturn = z.infer<typeof cmcPriceReturn>
