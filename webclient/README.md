# Wallet
The wallet that believers in mainstream digital currency always needed.

## Webclient
See webclient/README.md

## Gateway
See TrustedLifeGateway repository

## TODO
- Gateway
  - Generate Ethereum wallet address for user to transfer ETH, USDT
  - Generate Bitcoin wallet address for user to transfer BTC
  - Migrations for Accounts
  - Migrations for Funds

- Clients
  - Provide (QR code?) and address for sending ETH, USDT
  - Provide (QR code?) and address for sending BTC
  - Dashboard Page
  - AccountDetails Page
  - DepositOptions Page
    - DepositETH Page
    - DepositBTC Page
    - DepositUSDT Page
    // - DepositUSDCreditCard Page

## Product Description

### Wallet

#### Deposit wallets
- Launch with only BTC, ETH, USDT and add more later on (already supported)

##### Supported currencies: 
- Currencies: BTC, ETH, LTC, EOS, XRP, XLM, DOGE, etc, all major currencies
- ETH Tokens: 
  - Stable coins: USDT, USDC
  - ERC 721

##### Features
- Custodian wallet
- Support fancy transaction reports, showing all transaction and gain/loss
- Support display of all deposited currencies and the reflected current values in portfolio after all executed trades
- Allow users to transfer to stable coins and earn nominal interest
- Support for ERC 721 tokens
- Support in-wallet browsers, and allow game or other app integrations
- Support push notifications for all transactions in your wallet, or your wrapper coins

##### Versions
- MVP: with basic technology for deposit, transfer, etc.
- Full UI/UX design

## Tools

- QR Code - https://www.npmjs.com/package/qrcode

