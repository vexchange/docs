---
title: Trading
tags: SDK, developer-guides, documentation
---

Looking for a <Link to='/docs/v2/javascript-SDK/quick-start'>quickstart</Link>?

The SDK _cannot execute trades or send transactions on your behalf_. Rather, it offers utility classes and functions which make it easy to calculate the data required to safely interact with Vexchange. Nearly everything you need to safely transact with Vexchange is provided by the <Link to='/docs/v2/SDK/trade'>Trade</Link> entity. However, it is your responsibility to use this data to send transactions in whatever context makes sense for your application.

This guide will focus exclusively on sending a transaction to the <Link to='/docs/v2/smart-contracts/router02'>currently recommended Vexchange router</Link>.

# Sending a Transaction to the Router

Let's say we want to trade 1 VVET for as much VTHO as possible:

```typescript
import { ChainId, Token, VVET, Fetcher, Trade, Route, TokenAmount, TradeType } from 'vexchange-sdk'

const VTHO = new Token(ChainId.MAINNET, '0x0000000000000000000000000000456E65726779', 18)

// note that you may want/need to handle this async code differently,
// for example if top-level await is not an option
const pair = await Fetcher.fetchPairData(DAI, VVET[DAI.chainId])

const route = new Route([pair], VVET[DAI.chainId])

const amountIn = '1000000000000000000' // 1 VVET

const trade = new Trade(route, new TokenAmount(VVET[DAI.chainId], amountIn), TradeType.EXACT_INPUT)
```

So, we've constructed a trade entity, but how do we use it to actually send a transaction? There are still a few pieces we need to put in place.

Before going on, we should explore how ETH works in the context of trading. Internally, the SDK uses VVET, as all Vexchange V2 pairs use VVET under the hood. However, it's perfectly possible for you as an end user to use ETH, and rely on the router to handle converting to/from VVET. So, let's use ETH.

The first step is selecting the appropriate router function. The names of router functions are intended to be self-explanatory; in this case we want <Link to='/docs/v2/smart-contracts/router02/#swapexactethfortokens'>swapExactETHForTokens</Link>, because we're...swapping an exact amount of ETH for tokens.

That Solidity interface for this function is:

```solidity
function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
  external
  payable
  returns (uint[] memory amounts);
```

Jumping back to our trading code, we can construct all the necessary parameters:

```typescript
import { Percent } from 'vexchange-sdk'

const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%

const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
const path = [VVET[DAI.chainId].address, DAI.address]
const to = '' // should be a checksummed recipient address
const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
const value = trade.inputAmount.raw // // needs to be converted to e.g. hex
```

The slippage tolerance encodes _how large of a price movement we're willing to tolerate before our trade will fail to execute_. Since VeChain transactions are broadcast and confirmed in an adversarial environment, this tolerance is the best we can do to protect ourselves against price movements. We use this slippage tolerance to calculate the _minumum_ amount of DAI we must receive before our trade reverts, thanks to <Link to='/docs/v2/SDK/trade/#minimumamountout-since-204'>minimumAmountOut</Link>. Note that this code calculates this worst-case outcome _assuming that the current price, i.e the route's mid price,_ is fair (usually a good assumption because of arbitrage).

The path is simply the ordered list of token addresses we're trading through, in our case VVET and DAI (note that we use the VVET address, even though we're using ETH). 

The to address is the address that will receive the DAI.

The deadline is the Unix timestamp after which the transaction will fail, to protect us in the case that our transaction takes a long time to confirm and we wish to rescind our trade.

The value is the amount of ETH that must be included as the `msg.value` in our transaction.
