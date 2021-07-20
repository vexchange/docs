---
title: Supporting meta transactions
---

All Vexchange V2 pool tokens support meta-transaction approvals via the <Link to='/docs/v2/smart-contracts/pair-vip-180#permit'>permit</Link> function. This obviates the need for a blocking approve transaction before programmatic interactions with pool tokens can occur.

# ERC-712

In vanilla VIP-180 token contracts, owners may only register approvals by directly calling a function which uses `msg.sender` to permission itself. With meta-approvals, ownership and permissioning are derived from a signature passed into the function by the caller (sometimes referred to as the relayer). Because signing data with Ethereum private keys can be a tricky endeavor, Vexchange V2, like Uniswap relies on [ERC-712](https://eips.ethereum.org/EIPS/eip-712), a signature standard with widespread community support, to ensure user safety and wallet compatibility.

## Domain Separator

```solidity
keccak256(
  abi.encode(
    keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
    keccak256(bytes(name)),
    keccak256(bytes('1')),
    chainId,
    address(this)
  )
);
```

- `name` is always `Vexchange V2`, see <Link to='/docs/v2/smart-contracts/pair-VIP-180#name'>name</Link>.
- `chainId` is determined from the `chainid` opcode, available since [Vechain v1.5.0 that went live June 7 2021](https://github.com/vechain/thor/releases/tag/v1.5.0).
- `address(this)` is the address of the pair, see <Link to='/docs/v2/javascript-SDK/getting-pair-addresses/'>Pair Addresses</Link>.

## Permit Typehash

```solidity
keccak256('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)');`
```
