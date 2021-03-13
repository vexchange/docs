---
title: FAQ
---

<Info>Didn't find an answer? Join the <a href="https://t.me/vexchange">community Telegram</a> to get support</Info>

# What is Vexchange?

Vexchange is a protocol for creating liquidity and trading VIP-180 tokens on [VeChain](https://ethereum.org/en/what-is-ethereum/). It eliminates trusted intermediaries and unnecessary forms of rent extraction, allowing for fast, efficient trading. Where it makes tradeoffs decentralization, censorship resistance, and security are prioritized. Vexchange is open-source software licensed under GPL.

If you want to dive into details check out the [docs](/docs/v2/).

# How do I use Vexchange?

First you'll need an [Sync 2](https://medium.com/vechain-foundation/announcing-vechain-sync-2-unlocking-revolution-for-the-entire-blockchain-dapp-industry-enabling-5b1b21cd7b9b) and some [VET](https://ethereum.org/en/get-eth/). Once completed, head over to the [app](http://app.Vexchange.org/) to start using the protocol to provide liquidity or swap tokens. Remember that each transaction on VeChain costs VET (this is called the ["gas fee"](https://www.youtube.com/watch?v=AJvzNICwcwc&feature=emb_title) and it's paid to miners to keep the network running).

# How does Vexchange work?

Vexchange is an [automated liquidity protocol](https://ethereum.org/en/get-eth/#dex). In practical terms this means there are template smart contracts that define a standard way to make liquidity pools and corresponding markets that are compatible with eachother. There is no orderbook, no centralized party and no central facilitator of trade. Each pool is defined by a smart contract that includes a few functions to enable swapping tokens, adding liquidity and more. At its core each pool uses the function `x*y=k` to maintain a curve along which trades can happen. The pools keep track of reserves(liquidity) and updates those reserves every single time someone trades. Because the reserves are automated rebalanced a Vexchange pool can always be used to buy or sell a token without required a counterparty on the other side of your trade.

For a more in depth description. Check out the [How Vexchange works](/docs/v2/protocol-overview/how-Vexchange-works/) from the documentation.

# How are prices determined?

Prices are determined by the amount of each token in a pool. The smart contract maintains a constant using the following function: `x*y=k`. In this case `x = token0`, `y = token1`, `k = constant`. For each trade a certain amount of tokens are removed from the pool for an amount of the other token. To maintain `k`, the balances held by the smart contract are adjusted during the execution of the trade, therefore changing the price.

# I saw a token was trading at X value, but when I traded on Vexchange I got a much lower value!

Websites that show token prices, like eitherscan.io or coinmarketcap.com, typically aggregate price data from multiple sources. Some of these sources can be inaccurate, especially regarding new or low volume tokens. If a website or app says a token is worth more than what it shows on Vexchange, it is due to the website’s inaccurate data sources. Always check the exchange rate on the Vexchange app before trading.

# Why is my swap failing or stuck?

You might be trying to swap a fee on transfer or deflationary token. If so, you have to increase your allowed slippage to account for the fee taken during the swap. Click on the gear for settings and adjust Slippage tolerance accordingly.

Otherwise if your transaction is taking forever or stuck pending the gas included might be too low and the transaction will not be processed. You probably need to speed up or cancel the transaction in you wallet.

- Fix stuck transactions in MetaMask: [https://metamask.zendesk.com/hc/en-us/articles/360015489251-How-to-Speed-Up-or-Cancel-a-Pending-Transaction](https://metamask.zendesk.com/hc/en-us/articles/360015489251-How-to-Speed-Up-or-Cancel-a-Pending-Transaction)

- Fix stuck transactions in trust wallet: [https://www.publish0x.com/the-crypt/quick-guide-to-fixing-stuck-ethereum-transactions-xgdvgkv](https://www.publish0x.com/the-crypt/quick-guide-to-fixing-stuck-ethereum-transactions-xgdvgkv)

# Why is my approve stuck?

If you speed up an approve, Vexchange can't detect the new transaction. Open your wallet in the interface and click "clear all" then try refreshing the page.

# How do I find X token?

If you can't find a token in the default list, find the token address using etherscan and paste that address into the search field.

# How do I add a logo for a token?

Vexchange pulls from the trustwallet asset repository on github. [https://github.com/trustwallet/assets](https://github.com/trustwallet/assets) Add your token icon to that repo and it will appear on the frontend and on info.

# How can I add a token to Vexchange?

Vexchange is compatible with any VIP-180 token in the VeChain ecosystem. If you want your project to be searchable in their interface you should seek to be added to a reputable token list or share a link to your token using query parameters. Once loaded via link, the token will be added to their interface.

Another option is to open a request using github [issues](https://github.com/Vexchange/Vexchange-frontend/issues/new?assignees=&labels=token+request&template=token-request.md&title=).

The Vexchange team makes no guarantees or provides any timeline. Nor will the team ever charge or request funds. We've added many UX features to make it easier to share a new token with communities like local storage support and custom linking. Please make use of them.

# Why does my transaction cost X?

VeChain requires VTHO to execute each transaction. Creating a Vexchange pool is a slightly costlier transaction because you are executing a more complex smart contract. Read more about how gas works in VeChain.

# How can I see my liquidity provider fees?

TBD

# I accidentally transferred tokens directly to a pair contract, is there any way I can get them back?

Vexchange token pair contracts are ownerless. We have no special control over the pair contracts' functionality; because of this, any tokens accidentally transferred to the token contract itself are lost forever.

# I updated my token via a proxy contract, but the Vexchange information page is showing the old symbol / name!

[Info.Vexchange](https://info.Vexchange.org/) reads the details of new tokens when they're added to the subgraph. There may be some circumstances where an old symbol or name isn't updated if the token was updated with a proxy contract. A guide to fix this yourself is forthcoming, in the meantime, reach out with the details on our telegram.

# My swap failed with code "EXPIRED", what happened?

If a swap takes more than 20 minutes to execute, the router is programmed to fail the transaction. This is to protect the user from extreme swings in prices that can occur while the transaction is pending. If this happens, your tokens will still be in your wallet, but the gas fees paid are not recoverable. To keep this from happening, use a high enough gas price to have your transaction mined in under 20 minutes. This usually falls under "Standard" or "Fast" in most gas price calculators.

# Vexchange tools and resources

[https://github.com/Vexchange/universe](https://github.com/Vexchange/universe)
