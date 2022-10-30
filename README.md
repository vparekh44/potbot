# PotBot 

PotBot captures reactions across discord servers and aggregates
them into reputation points. Users can then mint tokens related to their reputation, quantifying and offering insights about interaction within the communities.

PotBot consists of 3 main parts:

### 1. Discord Js Bot 

The bot can be added to any Discord server. The bot cannot read any messages but track all reaction events and store them in the PostgreSQL database.
The bot is forked from [https://github.com/KevinNovak/Discord-Bot-TypeScript-Template](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template)

### 2. Frontend/Backend (Next.js)

Next.js provides a frontend and a set of API endpoints for wallet-based authentication and discord account linking. Once the user has linked his/her wallet and discord, the frontend allows token minting corresponding to the user's reputation.

Frontend uses https://github.com/WalletConnect/web3modal and IPFS for storing user ratings. 

### 3. Smart contracts

**FILL OUT THIS FIELD!**
