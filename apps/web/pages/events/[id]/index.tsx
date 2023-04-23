import { useRouter } from "next/router";
import {
  usePoaveyEvents,
  usePoaveyGetCommitments,
  usePreparePoaveyAnswerSurvey,
  usePoaveyAnswerSurvey,
} from "../../../libs";
import { BigNumber, ethers } from "ethers";
import { useAccount, useSignMessage, useSigner } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof, FullProof } from "@semaphore-protocol/proof";
import Image from "next/image";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { Poavey__factory } from "contracts";
import { useMounted } from "../../../libs";

const identityLocalStorageKey = (address: string, id: string) =>
  `identity-${address}-${id}`;

const getIdentity = (address: string, id: string): Identity | undefined => {
  const storageKey = identityLocalStorageKey(address, id);
  const identityString = localStorage.getItem(storageKey);

  if (!identityString) return;

  return new Identity(identityString);
};

const useIdentity = (id?: string) => {
  const [identity, setIdentity] = useState<Identity>();

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const saveIdentity = useCallback(
    (identityString: string) => {
      if (!id || !address) return;

      const storageKey = identityLocalStorageKey(address, id);
      localStorage.setItem(storageKey, identityString);

      const _identity = new Identity(identityString);
      setIdentity(_identity);

      return _identity;
    },
    [id, address]
  );

  const requestIdentity = useCallback(async () => {
    const identityString = await signMessageAsync({
      message: `${id}`,
    });

    return saveIdentity(identityString);
  }, [id, address, saveIdentity, signMessageAsync]);

  useEffect(() => {
    if (!id || !address) return;

    const identity = getIdentity(address, id);
    if (!identity) return;

    setIdentity(identity);
  }, [id, address]);

  return {
    identity,
    requestIdentity,
  };
};

const useAttendEvent = (
  id?: string,
  requestIdentity?: () => Promise<Identity>
) => {
  const { data: signer } = useSigner();
  const { signMessageAsync } = useSignMessage();

  const attendEvent = useCallback(async () => {
    if (!id) return;

    try {
      const identity = await requestIdentity();

      const poaveyContract = Poavey__factory.connect(
        process.env.NEXT_PUBLIC_POAVEY_CONTRACT_ADDRESS,
        signer
      );

      await poaveyContract.attendEvent(
        BigNumber.from(id),
        BigNumber.from(identity.commitment?.toString() ?? 0)
      );
    } catch (error) {
      console.error(error);
    }
  }, [id, signer, requestIdentity, signMessageAsync]);

  return {
    attendEvent,
  };
};

const useAnswerSurvey = (id?: string, identity?: Identity) => {
  const { data: signer } = useSigner();
  const { data: event } = usePoaveyEvents({
    enabled: !!id,
    args: [BigNumber.from(id ?? 0)],
  });

  const { data: commitments } = usePoaveyGetCommitments({
    enabled: !!id,
    args: [BigNumber.from(id ?? 0)],
    watch: true,
  });

  const answerSurvey = useCallback(async () => {
    if (!event || !commitments || !identity) return;

    const groupId = event.groupId.toString();

    const group = new Group(groupId);
    group.addMembers(commitments.map((c) => c.toString()));

    const signal = BigNumber.from(ethers.utils.formatBytes32String("1"));

    const { merkleTreeRoot, nullifierHash, proof } = await generateProof(
      identity,
      group,
      groupId,
      signal.toString()
    );

    const poaveyContract = Poavey__factory.connect(
      process.env.NEXT_PUBLIC_POAVEY_CONTRACT_ADDRESS,
      signer
    );
    await poaveyContract.answerSurvey(
      BigNumber.from(id),
      signal,
      BigNumber.from(merkleTreeRoot),
      BigNumber.from(nullifierHash),
      proof
    );
  }, [id, event, commitments, identity, signer]);

  return { answerSurvey };
};

export default function IndexPage() {
  const { query } = useRouter();
  const { id } = query;
  const { mounted } = useMounted();
  const { isConnected } = useAccount();
  const walletConnected = mounted && isConnected;

  const { identity, requestIdentity } = useIdentity(id as string);
  const { attendEvent } = useAttendEvent(id as string, requestIdentity);
  const { answerSurvey } = useAnswerSurvey(id as string, identity);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[50rem]">
        <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="grid grid-cols-1 gap-6">
            <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
              <div className="h-[200px] flex flex-col justify-center items-center m-4 bg-[#f5f4ff]">
                <Image
                  src="/ethtaipei.png"
                  alt="ethtaipei"
                  height={200}
                  width={200}
                />
              </div>
              <div className="p-4 md:p-6">
                <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                  ID 12345678
                </span>
                <h3 className="text-xl mb-1 font-semibold text-secondary">
                  EthTaipei Demo POAP
                </h3>
                <h5 className="flex items-center justify-start text-xs text-secondary">
                  <CalendarDaysIcon className="inline-block h-4 w-4 mr-1" /> Apr
                  21, 2023 - Apr 25, 2023
                </h5>
                <p className="mt-2 text-sm text-gray-500">
                  With a vibrant Ethereum and developer community, ETHTaipei
                  unites Ethereum-focused teams from across the globe,
                  showcasing Taiwan as a significant hub for blockchain
                  technology.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl mt-8 mb-4 font-semibold text-secondary">
            Attendance
          </h3>
          <button
            type="button"
            disabled={!walletConnected}
            onClick={attendEvent}
            className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-2 border border-transparent font-semibold bg-primary text-white hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all text-sm"
          >
            {walletConnected ? "Mint POAP" : "Need to connect wallet"}
          </button>

          <h3 className="text-xl mt-14 mb-4 font-semibold text-secondary">
            Feedback
          </h3>
          <button
            type="button"
            disabled={!walletConnected}
            onClick={answerSurvey}
            className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-2 border border-transparent font-semibold bg-primary text-white hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all text-sm"
          >
            {walletConnected ? "Feedback Submit" : "Need to connect wallet"}
          </button>
        </div>
      </div>
    </div>
  );
}

// mint button の status
// mint button の loading
// feedback button の status
// feedback button の loading
