import {Box, HStack, Text, VStack} from '@chakra-ui/react'
import {WhaleTokenType} from './BondingActions'
import {useRecoilState} from "recoil";
import {walletState, WalletStatusType} from "../../../state/atoms/walletAtoms";
import {convertMicroDenomToDenom} from "../../../util/conversion";
import {WhaleTooltip} from "../Bonding/WhaleTooltip";
import {AMP_WHALE_DENOM} from "../../../constants/bonding_contract";

const Withdraw = ({unbondingAmpWhale, unbondingBWhale, withdrawableAmpWhale, withdrawableBWhale, filteredUnbondingRequests, unbondingPeriodInNano}) => {

  const [{status}, _] = useRecoilState(walletState)

  const isWalletConnected = status === WalletStatusType.connected

  const calculateDurationString = (durationInSec: number): string => {
    if (durationInSec >= 86400) {
      return `${Math.floor(durationInSec / 86400)} days`;
    } else if (durationInSec >= 3600) {
      return `${Math.floor(durationInSec / 3600)} hours`;
    } else if (durationInSec >= 60) {
      return `${Math.floor(durationInSec / 60)} minutes`;
    } else if (durationInSec > 0) {
      return `${Math.floor(durationInSec)} seconds`;
    } else {
      return `imminent`;
    }
  };

  const ProgressBar = ({percent}) => {
    return (
      <Box
        h="3px"
        minW={450}
        bg="whiteAlpha.400"
        borderRadius="10px"
        overflow="hidden">
        <Box
          h="100%"
          bg="#7CFB7D"
          w={`${percent}%`}
          borderRadius="10px"/>
      </Box>
    );
  }

  const TokenBox = ({label, ampWhale, bWhale}) => {
    return <Box
      border="0.5px solid"
      borderColor="whiteAlpha.400"
      borderRadius="10px"
      p={4}
      minW={240}>
      <WhaleTooltip label={label} data={null} withdrawableAmpWhale={ampWhale} withdrawableBWhale={bWhale}
                    isWalletConnected={isWalletConnected}
                    tokenType={null}/>
      <Text
        mb="-0.2rem"
        fontSize={23}
        fontWeight="bold">
        {isWalletConnected ? `${(ampWhale + bWhale).toLocaleString()}` : "n/a"}
      </Text>
    </Box>
  }

  const BoxComponent = ({whaleTokenType, value, durationInSeconds}) => {
    const durationString = calculateDurationString(durationInSeconds);
    return <VStack justifyContent="center" alignItems="center" mb={30}>
      <HStack justifyContent="space-between" alignItems="flex-start" w="100%" px={4}>
        <Text>
          {value.toLocaleString()} {WhaleTokenType[whaleTokenType]}
        </Text>
        <HStack
          spacing={4}>
          <Text>
            ~ {durationString}
          </Text>
        </HStack>
      </HStack>
      <ProgressBar
        percent={(1 - durationInSeconds / (unbondingPeriodInNano / 1_000_000_000)) * 100}/>
    </VStack>
  }

  return <VStack
    spacing={5}
    mb={35}>
    <HStack
      spacing={7}>
      <TokenBox label="Unbonding" ampWhale={unbondingAmpWhale} bWhale={unbondingBWhale}/>
      <TokenBox label="Withdrawable" ampWhale={withdrawableAmpWhale}
                bWhale={withdrawableBWhale}/>
    </HStack>
    {(isWalletConnected && filteredUnbondingRequests !== null && filteredUnbondingRequests.length > 0) && <Box
      overflowY="scroll"
      maxHeight={340}
      minW={510}
      backgroundColor="black"
      padding="4"
      borderRadius="10px"
      mt={10}>
      {filteredUnbondingRequests.map(type => {
        const currentTimeInNano = Date.now() * 1_000_000;
        const durationInSeconds =
          (Number(type.timestamp) +
            unbondingPeriodInNano -
            currentTimeInNano) /
          1_000_000_000;
        return <BoxComponent
          whaleTokenType={type.asset.info.native_token.denom == AMP_WHALE_DENOM ? WhaleTokenType.ampWHALE : WhaleTokenType.bWHALE}
          value={convertMicroDenomToDenom(Number(type.asset.amount), 6)}
          durationInSeconds={durationInSeconds}/>
      })}
    </Box>}
  </VStack>
}

export default Withdraw
