---
title: Other Exports
tags: sdk, documentation
---

# JSBI

```typescript
import { JSBI } from 'vexchange-sdk'
// import JSBI from 'jsbi'
```

The default export from [jsbi](https://github.com/GoogleChromeLabs/jsbi).

# BigintIsh

```typescript
import { BigintIsh } from 'vexchange-sdk'
// type BigintIsh = JSBI | bigint | string
```

A union type comprised of all types that can be cast to a JSBI instance.

# ChainId

```typescript
import { ChainId } from 'vexchange-sdk'
// enum ChainId {
//   TESTNET = 0x27
//   MAINNET = 0x4a,
// }
```

A enum denominating supported chain IDs.

# TradeType

```typescript
import { TradeType } from 'vexchange-sdk'
// enum TradeType {
//   EXACT_INPUT,
//   EXACT_OUTPUT
// }
```

A enum denominating supported trade types.

# Rounding

```typescript
import { Rounding } from 'vexchange-sdk'
// enum Rounding {
//   ROUND_DOWN,
//   ROUND_HALF_UP,
//   ROUND_UP
// }
```

A enum denominating supported rounding options.

# FACTORY_ADDRESS

```typescript
import { FACTORY_ADDRESS } from 'vexchange-sdk'
```

The <Link to='/docs/v2/smart-contracts/factory/#address'>factory address</Link>.

# INIT_CODE_HASH

```typescript
import { INIT_CODE_HASH } from 'vexchange-sdk'
```

See <Link to='/docs/v2/smart-contracts/factory/#address'>Pair Addresses</Link>.

# MINIMUM_LIQUIDITY

```typescript
import { MINIMUM_LIQUIDITY } from 'vexchange-sdk'
```

See <Link to='/docs/v2/protocol-overview/smart-contracts/#minimum-liquidity'>Minimum Liquidity</Link>.

# InsufficientReservesError

```typescript
import { InsufficientReservesError } from 'vexchange-sdk'
```

# InsufficientInputAmountError

```typescript
import { InsufficientInputAmountError } from 'vexchange-sdk'
```

# WETH

```typescript
import { WETH } from 'vexchange-sdk'
```

An object whose values are <Link to='/docs/v2/smart-contracts/router02/#weth'>WETH</Link> <Link to='/docs/v2/SDK/token'>Token</Link> instances, indexed by [ChainId](#chainid).
