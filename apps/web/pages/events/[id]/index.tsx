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
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, FullProof } from "@semaphore-protocol/proof"

export default function IndexPage() {
  const { query } = useRouter();
  const { id } = query;

  const [identity, setIdentity] = useState<Identity>();
  const [fullProof, setFullProof] = useState<FullProof>();
  const { address } = useAccount();

  const {data: commitments} = usePoaveyGetCommitments({
    enabled: !!id,
    args: [id ? BigNumber.from(id) : undefined]
  })

  const { data: event } = usePoaveyEvents({
    enabled: !!id,
    args: [id ? BigNumber.from(id) : undefined],
  });

  const { data, isError, isLoading, isSuccess, signMessageAsync } =
    useSignMessage();

  const { config: configAttend } = usePreparePoaveyAttendEvent({
    enabled: !!id && !!identity,
    args: [
      BigNumber.from(id ?? "0x0"),
      BigNumber.from(identity?.commitment?.toString() ?? "0x0"),
    ],
  });

  const { write: attend } = usePoaveyAttendEvent(configAttend);

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

    const group = new Group(event.groupId.toString())

    const signal = BigNumber.from(ethers.utils.formatBytes32String("1")).toString()

    group.addMembers(commitments.map((c) => c.toString()))

    const _proof = await generateProof(
        identity,
        group,
        event.groupId.toString(),
        signal
    )
    setFullProof(_proof)
  }, [event, commitments, identity]);

  const {config: configAnswer } = usePreparePoaveyAnswerSurvey({
    enabled: !!id && !!fullProof?.proof,
    args: [
      BigNumber.from(id ?? "0x0"),
      BigNumber.from(ethers.utils.formatBytes32String("1")),
      BigNumber.from(fullProof?.merkleTreeRoot ?? "0x0"),
      BigNumber.from(fullProof?.nullifierHash ?? "0x0"),
      fullProof?.proof as any
    ]
  })

  const {writeAsync: answer } = usePoaveyAnswerSurvey(configAnswer)

  const handleAnswer = useCallback(async () => {
    const tx = await answer()
    const receipt = await tx.wait()
    console.log(tx.hash, receipt.status)
  }, [fullProof, answer])

  useEffect(() => {
    if (!id || !address) return;
    const identityString = localStorage.getItem(`identity-${address}-${id}`);

    if (!identityString) return;
    setIdentity(new Identity(identityString));
  }, [id, address]);

  return (
    <div>
      eventId: {event?.eventId?.toString()}
      <br />
      groupId: {event?.groupId?.toString()}
      <button onClick={handleSignMessage}>署名する</button>
      <button disabled={!attend} onClick={() => attend?.()} >参加する</button>
      <button onClick={handleProof}>Generate Proof</button>
      <button onClick={handleAnswer}>Generate Proof</button>
    </div>
  );
}
