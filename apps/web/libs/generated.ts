// Generated by @wagmi/cli@0.1.15 on 2023/4/22 at 18:21:12
import {
  useContract,
  UseContractConfig,
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  Address,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Poavey
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export const poaveyABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'semaphoreAddress', internalType: 'address', type: 'address' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'attendee',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'EventAttended',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'eventId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'EventRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'answers',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'SurveyAnswered',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'answers', internalType: 'uint256', type: 'uint256' },
      { name: 'merkleTreeRoot', internalType: 'uint256', type: 'uint256' },
      { name: 'nullifierHash', internalType: 'uint256', type: 'uint256' },
      { name: 'proof', internalType: 'uint256[8]', type: 'uint256[8]' },
    ],
    name: 'answerSurvey',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'identityCommitment', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'attendEvent',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'events',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      { name: 'eventId', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getCommitments',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'attendee', internalType: 'address', type: 'address' },
    ],
    name: 'isAttendee',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'nullifierHash', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isNullifierExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'eventId', internalType: 'uint256', type: 'uint256' },
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'registerEvent',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'semaphore',
    outputs: [
      { name: '', internalType: 'contract ISemaphore', type: 'address' },
    ],
  },
] as const

/**
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export const poaveyAddress = {
  421613: '0xb0B4e3E8Dd190478F2424AD241e3090877E736c7',
} as const

/**
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export const poaveyConfig = { address: poaveyAddress, abi: poaveyABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContract}__ with `abi` set to __{@link poaveyABI}__.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoavey(
  config: Omit<UseContractConfig, 'abi' | 'address'> & {
    chainId?: keyof typeof poaveyAddress
  } = {} as any,
) {
  return useContract({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    ...config,
  })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link poaveyABI}__.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof poaveyABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof poaveyABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return useContractRead({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    ...config,
  } as UseContractReadConfig<typeof poaveyABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"events"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyEvents<
  TSelectData = ReadContractResult<typeof poaveyABI, 'events'>,
>(
  config: Omit<
    UseContractReadConfig<typeof poaveyABI, 'events', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return useContractRead({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'events',
    ...config,
  } as UseContractReadConfig<typeof poaveyABI, 'events', TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"getCommitments"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyGetCommitments<
  TSelectData = ReadContractResult<typeof poaveyABI, 'getCommitments'>,
>(
  config: Omit<
    UseContractReadConfig<typeof poaveyABI, 'getCommitments', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return useContractRead({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'getCommitments',
    ...config,
  } as UseContractReadConfig<typeof poaveyABI, 'getCommitments', TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"isAttendee"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyIsAttendee<
  TSelectData = ReadContractResult<typeof poaveyABI, 'isAttendee'>,
>(
  config: Omit<
    UseContractReadConfig<typeof poaveyABI, 'isAttendee', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return useContractRead({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'isAttendee',
    ...config,
  } as UseContractReadConfig<typeof poaveyABI, 'isAttendee', TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"isNullifierExists"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyIsNullifierExists<
  TSelectData = ReadContractResult<typeof poaveyABI, 'isNullifierExists'>,
>(
  config: Omit<
    UseContractReadConfig<typeof poaveyABI, 'isNullifierExists', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return useContractRead({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'isNullifierExists',
    ...config,
  } as UseContractReadConfig<
    typeof poaveyABI,
    'isNullifierExists',
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"semaphore"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveySemaphore<
  TSelectData = ReadContractResult<typeof poaveyABI, 'semaphore'>,
>(
  config: Omit<
    UseContractReadConfig<typeof poaveyABI, 'semaphore', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return useContractRead({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'semaphore',
    ...config,
  } as UseContractReadConfig<typeof poaveyABI, 'semaphore', TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link poaveyABI}__.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyWrite<
  TMode extends WriteContractMode,
  TFunctionName extends string,
  TChainId extends number = keyof typeof poaveyAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof poaveyABI, string>['abi'],
        TFunctionName
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<TMode, typeof poaveyABI, TFunctionName> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<TMode, typeof poaveyABI, TFunctionName>({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"answerSurvey"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyAnswerSurvey<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof poaveyAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof poaveyABI, 'answerSurvey'>['abi'],
        'answerSurvey'
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'answerSurvey'
      }
    : UseContractWriteConfig<TMode, typeof poaveyABI, 'answerSurvey'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'answerSurvey'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof poaveyABI, 'answerSurvey'>({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'answerSurvey',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"attendEvent"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyAttendEvent<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof poaveyAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof poaveyABI, 'attendEvent'>['abi'],
        'attendEvent'
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'attendEvent'
      }
    : UseContractWriteConfig<TMode, typeof poaveyABI, 'attendEvent'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'attendEvent'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof poaveyABI, 'attendEvent'>({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'attendEvent',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"registerEvent"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyRegisterEvent<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof poaveyAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof poaveyABI, 'registerEvent'>['abi'],
        'registerEvent'
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'registerEvent'
      }
    : UseContractWriteConfig<TMode, typeof poaveyABI, 'registerEvent'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'registerEvent'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof poaveyABI, 'registerEvent'>({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'registerEvent',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link poaveyABI}__.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePreparePoaveyWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof poaveyABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    ...config,
  } as UsePrepareContractWriteConfig<typeof poaveyABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"answerSurvey"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePreparePoaveyAnswerSurvey(
  config: Omit<
    UsePrepareContractWriteConfig<typeof poaveyABI, 'answerSurvey'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'answerSurvey',
    ...config,
  } as UsePrepareContractWriteConfig<typeof poaveyABI, 'answerSurvey'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"attendEvent"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePreparePoaveyAttendEvent(
  config: Omit<
    UsePrepareContractWriteConfig<typeof poaveyABI, 'attendEvent'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'attendEvent',
    ...config,
  } as UsePrepareContractWriteConfig<typeof poaveyABI, 'attendEvent'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link poaveyABI}__ and `functionName` set to `"registerEvent"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePreparePoaveyRegisterEvent(
  config: Omit<
    UsePrepareContractWriteConfig<typeof poaveyABI, 'registerEvent'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    functionName: 'registerEvent',
    ...config,
  } as UsePrepareContractWriteConfig<typeof poaveyABI, 'registerEvent'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link poaveyABI}__.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof poaveyABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return useContractEvent({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    ...config,
  } as UseContractEventConfig<typeof poaveyABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link poaveyABI}__ and `eventName` set to `"EventAttended"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyEventAttendedEvent(
  config: Omit<
    UseContractEventConfig<typeof poaveyABI, 'EventAttended'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return useContractEvent({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    eventName: 'EventAttended',
    ...config,
  } as UseContractEventConfig<typeof poaveyABI, 'EventAttended'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link poaveyABI}__ and `eventName` set to `"EventRegistered"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveyEventRegisteredEvent(
  config: Omit<
    UseContractEventConfig<typeof poaveyABI, 'EventRegistered'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return useContractEvent({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    eventName: 'EventRegistered',
    ...config,
  } as UseContractEventConfig<typeof poaveyABI, 'EventRegistered'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link poaveyABI}__ and `eventName` set to `"SurveyAnswered"`.
 *
 * [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xb0B4e3E8Dd190478F2424AD241e3090877E736c7)
 */
export function usePoaveySurveyAnsweredEvent(
  config: Omit<
    UseContractEventConfig<typeof poaveyABI, 'SurveyAnswered'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof poaveyAddress } = {} as any,
) {
  return useContractEvent({
    abi: poaveyABI,
    address: poaveyAddress[421613],
    eventName: 'SurveyAnswered',
    ...config,
  } as UseContractEventConfig<typeof poaveyABI, 'SurveyAnswered'>)
}
