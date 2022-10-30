import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { Wallet } from 'ethers';
import fg from 'fast-glob';

import '@nomicfoundation/hardhat-chai-matchers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';

dotenv.config();

const files = fg.sync(['./tasks/**/*.task.ts'], { dot: true });
for (const file of files) {
  require(file);
}

const config: HardhatUserConfig = {
  solidity: '0.8.14',
  defaultNetwork: 'hardhat',
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.I_KEY}`,
      chainId: 80001,
      accounts: [process.env.P_KEY || Wallet.createRandom().privateKey],
    },
  },
};

export default config;
