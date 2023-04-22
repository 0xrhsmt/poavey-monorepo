import { useRouter } from "next/router";
import {
  usePoaveyEvents,
  usePreparePoaveyAttendEvent,
  usePoaveyAttendEvent,
  usePoaveyGetCommitments,
  usePreparePoaveyAnswerSurvey,
  usePoaveyAnswerSurvey,
} from "../../../libs";
import { BigNumber, ethers } from "ethers";
import { useAccount, useSignMessage } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof, FullProof } from "@semaphore-protocol/proof";
import Image from "next/image";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

export default function IndexPage() {
  const { query } = useRouter();
  const { id } = query;

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [identity, setIdentity] = useState<Identity>();
  const [fullProof, setFullProof] = useState<FullProof>();

  const { data: event } = usePoaveyEvents({
    enabled: !!id,
    args: [BigNumber.from(id ?? 0)],
  });

  const { data: commitments } = usePoaveyGetCommitments({
    enabled: !!id,
    args: [BigNumber.from(id ?? 0)],
  });

  const { config: configAttendEvent } = usePreparePoaveyAttendEvent({
    enabled: !!id && !!identity,
    args: [
      BigNumber.from(id ?? 0),
      BigNumber.from(identity?.commitment?.toString() ?? 0),
    ],
  });
  const { write: attendEvent } = usePoaveyAttendEvent(configAttendEvent);

  const { config: configAnswerSurvey } = usePreparePoaveyAnswerSurvey({
    enabled: !!id && !!fullProof?.proof,
    args: [
      BigNumber.from(id ?? 0),
      BigNumber.from(ethers.utils.formatBytes32String("1")),
      BigNumber.from(fullProof?.merkleTreeRoot ?? 0),
      BigNumber.from(fullProof?.nullifierHash ?? 0),
      fullProof?.proof as any,
    ],
  });
  const { writeAsync: answerSurvey } = usePoaveyAnswerSurvey(configAnswerSurvey);


  const handleSignMessage = useCallback(async () => {
    if (!id) return;

    try {
      const identityString = await signMessageAsync({
        message: `${id}`,
      });
      localStorage.setItem(`identity-${address}-${id}`, identityString);

      setIdentity(new Identity(identityString));
    } catch (error) {
      console.error(error);
    }
  }, [id, address, signMessageAsync]);

  const handleProof = useCallback(async () => {
    if (!event || !commitments || !identity) return;

    const group = new Group(event.groupId.toString());

    const signal = BigNumber.from(
      ethers.utils.formatBytes32String("1")
    ).toString();

    group.addMembers(commitments.map((c) => c.toString()));

    const _proof = await generateProof(
      identity,
      group,
      event.groupId.toString(),
      signal
    );
    setFullProof(_proof);
  }, [event, commitments, identity]);

  const handleAnswer = useCallback(async () => {
    const tx = await answerSurvey();
    const receipt = await tx.wait();
  }, [fullProof, answerSurvey]);

  useEffect(() => {
    if (!id || !address) return;
    const identityString = localStorage.getItem(`identity-${address}-${id}`);

    if (!identityString) return;
    setIdentity(new Identity(identityString));
  }, [id, address]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[50rem]">
        <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="grid grid-cols-1 gap-6">
            <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
              <div className="h-[200px] flex flex-col justify-center items-center m-4 bg-[#f5f4ff] rounded-2xl">
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
                  EthTaipei Demo POAPs
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
            className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-primary text-white hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all text-sm"
          >
            Mint POAP
          </button>

          <h3 className="text-xl mt-14 mb-4 font-semibold text-secondary">
            Feedback
          </h3>
          <button
            type="button"
            className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-primary text-white hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all text-sm"
          >
            Submit
          </button>
        </div>

        <div>
          eventId: {event?.eventId?.toString()}
          <br />
          groupId: {event?.groupId?.toString()}
          <button onClick={handleSignMessage}>署名する</button>
          <button disabled={!attendEvent} onClick={() => attendEvent?.()}>
            参加する
          </button>
          <button onClick={handleProof}>Generate Proof</button>
          <button onClick={handleAnswer}>Generate Proof</button>
        </div>
      </div>
    </div>
  );
}
