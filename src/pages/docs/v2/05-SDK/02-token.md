---
title: Token
tags: sdk, documentation
---

```typescript
constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string)
```

The Token entity represents an VIP-180 token at a specific address on a specific chain.

# Example

```typescript
import { ChainId, Token } from 'vexchange-sdk'

const token = new Token(ChainId.MAINNET, '0x0000000000000000000000000000456E65726779', 18, 'HOT', 'Caffeine')
```

# Properties

## chainId

```typescript
chainId: ChainId
```

See <Link to='/docs/v2/SDK/other-exports/#chainid'>ChainId</Link>.

## address

```typescript
address: string
```

## decimals

```typescript
decimals: number
```

## symbol

```typescript
symbol?: string
```

## name

```typescript
name?: string
```

# Methods

## equals

```typescript
equals(other: Token): boolean
```

Checks if the current instance is equal to another (has an identical chainId and address).

## sortsBefore

```typescript
sortsBefore(other: Token): boolean
```

Checks if the current instance sorts before another, by address.
