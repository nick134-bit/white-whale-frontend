import React from 'react';

import { List } from '@chakra-ui/react';
import { WalletType } from 'components/Wallet/Modal/WalletModal';
import { COSMOS_KIT_WALLET_KEY } from 'constants/index';
import { useChainInfos } from 'hooks/useChainInfo';

import ChainItem from './ChainItem';

const useFilteredChains = (connectedChainIds) => {
  const chains = useChainInfos();
  const walletType = window.localStorage.getItem(COSMOS_KIT_WALLET_KEY);

  const connectedChains = [];
  const removedChains = [];

  chains.forEach((chain) => {
    const isChainConnected =
      walletType === WalletType.leapSnap
        ? chain.coinType === 118
        : connectedChainIds.includes(chain.chainId);

    if (isChainConnected) {
      connectedChains.push(chain);
    } else {
      removedChains.push(chain);
    }
  });

  return [connectedChains, removedChains];
};

const ChainList = ({ onChange, onClose, currentChainState, connectedChainIds }) => {
  const [connectedChains, removedChains] = useFilteredChains(connectedChainIds);

  return (
    <List spacing={1} color="white" width="full">
      {connectedChains.map((chain, index) => (
        <ChainItem
          key={chain?.chainId}
          chain={chain}
          index={index}
          onChange={onChange}
          onClose={onClose}
          chainList={connectedChains}
          active={currentChainState?.chainId === chain?.chainId}
          walletConnected={true}
        />
      ))}
      {removedChains.map((chain, index) => (
        <ChainItem
          key={chain?.chainId}
          chain={chain}
          index={index}
          onChange={onChange}
          onClose={onClose}
          chainList={connectedChains}
          active={currentChainState?.chainId === chain?.chainId}
          walletConnected={false}
        />
      ))}
    </List>
  );
};

export default ChainList;
