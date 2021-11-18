---
title: Differences between Vexchange V2 and Uniswap V2
tags: protocol-overview, documentation
---
# Summary delta between Vexchange V2 and Uniswap V2

This section outlines the key differences between Vexchange V2 and Uniswap V2, and walks through each of the areas of difference in the smart contract implementation.

## Variable Fees

Vexchange V2 introduced the ability to adjust swap fees up and down through governance.

This feature was present in V1 but was underutilized, as no active governance mechanism was developed. In V2, we plan to deploy and encourage active governance over the platform to ensure Vexchange meets its goals of providing the best VIP180 swap experience possible.

Uniswap V3 has also moved towards multiple fee levels, which reinforces the value variable swap & platform fees will add to the Vexchange ecosystem.

The fee implementation is 100% consistent with the original protocol fee equations outlined in the original [Uniswap whitepaper](https://uniswap.org/whitepaper.pdf) (see equation 6), with our contract efficiently implementing a derivation of the equation maintaining the fee variable Phi.

Swap fees can be set to a value in a range from 0.05% to 2%, and platform fee can be up to 50%.

Vexchange V2 will launch with the same fee configuration as V1 to aid in a seamless migration. However, we expect that the community will quickly want to move towards refining the fee configuration towards something more efficient for each asset being traded.

Default fee parameters for pair creation and setting pair-specific parameters is managed by the [VexchangeV2Factory](#Contract:%20VexchangeV2Factory), however specific fees and the fee calculations are maintained on the [VexchangeV2Pair](#Contract:%20VexchangeV2Pair) contract itself.

See the VexchangeV2Pair method [_calcFee()](#calcFee%20method) for more details on the platform fee calculation.


## Recoverer Mechanism
Vexchange V2 introduces the concept of token recovery, for tokens that have been invalidly transferred into a given Vexchange V2 pair.

The VexchangeV2Pair supports transferral of token balances that may be held by the pair, so long as they are not for tokens of one of the pairs swapping tokens. The mechanism does not allow transfer to the zero address.

This mechanism is supported by only a single _recovery address_, managed by Vexchange governance. In operation, default recoverer address is defined on the VexchangeV2Factory, with the actual address to be used defined on a given VexchangeV2Pair.

See accessors on the VexchangeV2Factory and VexchangeV2Pair, as well as the recoverTokens method on the VexchangeV2Pair for more information.

See the VexchangeV2Pair method [recoverToken](#recoverToken%20method) for more details on the recover operation.

## Contract: VexchangeV2Factory
The changes in the factory contract primarily cover the introduction of the foundational elements of variable fee support.  This includes state management and updating support for the fee variables, the recoverer mechanism and changes to the Factory construction and Pair initialization.

### Ownable
The VexchangeV2Factory contract applies the _Ownable_ contract pattern, implemented through inheritance of functionality defined in the contract Ownable, defined in contracts/libraries.

This implementation of the Ownable pattern is minimalist, supporting only tracking the current owner, transfer of ownership and defining the _onlyOwner_ modifier; which applies the access restriction to the various ExchangeV2Factory methods.

### Constants
Constants have been defined for defining the range of both the swap fee and platform fee. This constants are used as requirements around valid values of the variable fees during their setting and initialization.

### Variable Fee state
Another necessary addition to the factory was a set of variables to maintain the variable fee current state, which is held in variables prefixed as "default..."; which means the default values the Factory holds to initialize a new Pair. During the initialization itself, the Pair may be initialized with fee parameters as required.

### Contract Events
All aspects of the contract operation are covered by the emitted contract events, and so the Uniswap V2 events have been extended with additional events to cover fee variable state changes and changes to the recoverer address.

```solidity
event PairCreated(address indexed token0, address indexed token1, address pair, uint, uint swapFee, uint platformFee);
event PlatformFeeToChanged(address oldFeeTo, address newFeeTo);
event DefaultSwapFeeChanged(uint oldDefaultSwapFee, uint newDefaultSwapFee);
event DefaultPlatformFeeChanged(uint oldDefaultPlatformFee, uint newDefaultPlatformFee);
event DefaultRecovererChanged(address oldDefaultRecoverer, address newDefaultRecoverer);
```

### Factory Construction
The VexchangeV2Factory constructor has a new signature, but a functionally simple change. It adds parameters for initializing the default fee parameters, and the default recoverer account.

```solidity
constructor( uint _defaultSwapFee, uint _defaultPlatformFee, address _defaultRecoverer ) public
```

### Pair Construction
The createPair method, responsibility for spawning the swap contracts for specific pairs, has been augmented to initialize the pair-contracts with the Factory default fee parameters.

For compatibility and minimization of change, the method's interface remains unchanged as can be seen below, though the values set for swap-fee and platform-fee are emitted in the associated event for auditability.

```solidity
function createPair(address tokenA, address tokenB) external returns (address pair)

emit PairCreated(token0, token1, pair, allPairs.length, defaultSwapFee, defaultPlatformFee);
```

The Pair supports public methods for future maintenance of the fee parameters.

### New Accessor Methods
Several additional methods have been added for setting or retrieving Factory state, they are:

#### getPairInitHash()
A convenience method to access the Pair contract initialization hash in dependent code.
```solidity
function getPairInitHash() public pure returns(bytes32)
```

#### setPlatformFeeTo()
```solidity
function setPlatformFeeTo(address _platformFeeTo) external onlyOwner
```

#### setDefaultSwapFee()
Default swap-fee is used when creating new Pairs.
```solidity
function setDefaultSwapFee(uint _swapFee) external onlyOwner
```

#### defaultPlatformFeeOn()
A utility method analogous to the Uniswap feeOn determination. In Vexchange, the fee is defined as "on" when the platform-fee is greater than 0.
```solidity
function defaultPlatformFeeOn() external view returns (bool _platformFeeOn)
```

#### setDefaultPlatformFee()
Default platform-fee is used when creating new Pairs.
```solidity
function setDefaultPlatformFee(uint _platformFee) external onlyOwner
```

#### setDefaultRecoverer()
Default recoverer is used when creating new Pairs.
```solidity
function setDefaultRecoverer(address _recoverer) external onlyOwner
```

#### setSwapFeeForPair()
Sets the swap-fee on a specific pair contract.
```solidity
function setSwapFeeForPair(address _pair, uint _swapFee) external onlyOwner
```

#### setPlatformFeeForPair()
Sets the platform-fee on a specific pair contract.
```solidity
function setPlatformFeeForPair(address _pair, uint _platformFee) external onlyOwner
```

#### setRecovererForPair()
```solidity
function setRecovererForPair(address _pair, address _recoverer) external onlyOwner
```
Sets the recovery address on a specific pair contract.

## Contract: VexchangeV2Pair

The ExchangeV2Pair is the most significantly modified contract from the original Uniswap V2 implementation.

### New constants and contract state
Constants have been added for the variable fee calculations - for range constraints for the fee values, as well as accuracy multipliers. These accuracy constants are used to support accurate calculation of the platform fee.

Additional state variables were added to support the swap-fee and platform-fee, and the recoverer address.

### New Events
Events were added to VexchangeV2Pair to notify of all transactions occurring through the contract.

```solidity
event SwapFeeChanged(uint oldSwapFee, uint newSwapFee);
event PlatformFeeChanged(uint oldPlatformFee, uint newPlatformFee);
event RecovererChanged(address oldRecoverer, address newRecoverer);
```

### calcFee method
The __calcFee_ method calculates the appropriate platform fee in terms of tokens that will be minted, based on the growth in sqrt(k), the amount of liquidity in the pool, and the set variable fee in basis points.

```solidity
function _calcFee(uint _sqrtNewK, uint _sqrtOldK, uint _platformFee, uint _circulatingShares) internal pure returns (uint _sharesToIssue)
```

This function implements the equation defined in the Uniswap V2 whitepaper for calculating platform fees, on which their fee calculation implementation is based. This is a refactored form of equation 6, on page 5 of the Uniswap whitepaper; see https://uniswap.org/whitepaper.pdf for further details.

The specific difference between the Uniswap V2 implementation and this fee calculation is the fee variable, which remains a variable with range 0-50% here, but is fixed at (1/6)% in Uniswap V2.

The mathematical equation:
If 'Fee' is the platform fee, and the previous and new values of the square-root of the invariant k, are K1 and K2 respectively; this equation, in the form coded here can be expressed as:

  _sharesToIssue = totalSupply * Fee * (1 - K1/K2) / ( 1 - Fee * (1 - K1/K2) )

A reader of the whitepaper will note that this equation is not a literally the same as equation (6), however with some straight-forward algebraic manipulation they can be shown to be mathematically equivalent.

### recoverToken method
Recover the specified token from the VexchangeV2Pair, transferring it to the defined recoverer address.
```solidity
function recoverToken(address token) external
```

The requirements of this method guarantee that neither of the pairs swapping tokens can be transferred by this method, or that the balance can be sent to the zero address.

### New Accessor methods
Several additional methods have been added for setting or retrieving Pair state, they are:

#### platformFeeOn()
Convenience function, returning whether or not the platform fee is engaged; true if the platform-fee is greater than zero.
```solidity
function platformFeeOn() external view returns (bool _platformFeeOn)
```

#### setSwapFee()
Allows the swap-fee to be set on this pair; this is callable only by the parent VexchangeV2Factory.
```solidity
function setSwapFee(uint _swapFee) external onlyFactory
```

#### setPlatformFee()
Allows the platform-fee to be set on this pair; this is callable only by the parent VexchangeV2Factory.
```solidity
function setPlatformFee(uint _platformFee) external onlyFactory
```

#### setRecoverer()
Allows the recoverer address to be set on this pair; this is callable only by the parent VexchangeV2Factory.
```solidity
function setRecoverer(address _recoverer) external onlyFactory
```

## Contract: VExchangeV2ERC20

This contract was cosmeticaly changed only, with some constants modified, such as the name used in the EIP-712 domain separator encoding (to 'Vexchange').

Also note that since this contract references the chainid, which is implicitly defined in the EVM, aside from the name change to Vexchange V2, the ABI encoding of the DOMAIN_SEPARATOR would not be byte equivalent to Uniswap V2.
