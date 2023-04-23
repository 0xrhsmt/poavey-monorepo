import { useRouter } from "next/router";
import {
  usePoaveyEvents,
  usePoaveyGetCommitments,
  usePoaveyGetSurveyOptions,
  usePoaveySurveyAnsweredEvent,
  usePoaveyIsAttendee,
  usePoaveyGetAnswers
} from "../../../libs";
import { BigNumber, ethers } from "ethers";
import { useAccount, useSignMessage, useSigner } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof, FullProof } from "@semaphore-protocol/proof";
import Image from "next/image";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { Poavey__factory } from "../../../libs/typechain-types";
import { useMounted } from "../../../libs";
import { useForm } from "react-hook-form";

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
    [id, address, setIdentity]
  );

  const requestIdentity = useCallback(async () => {
    const identityString = await signMessageAsync({
      message: `${id}`,
    });

    return saveIdentity(identityString);
  }, [id, saveIdentity]);

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
  }, [id, signer, requestIdentity]);

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

  const answerSurvey = useCallback(async (question1, question2, question3) => {
    if (!event || !commitments || !identity) return;

    const groupId = event.groupId.toString();

    const group = new Group(groupId);
    group.addMembers(commitments.map((c) => c.toString()));

    const signal = BigNumber.from(ethers.utils.formatBytes32String(`${question1}${question2}${question3}`));

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
  const { address, isConnected } = useAccount();
  const walletConnected = mounted && isConnected;

  const { identity, requestIdentity } = useIdentity(id as string);
  const { attendEvent } = useAttendEvent(id as string, requestIdentity);
  const { answerSurvey } = useAnswerSurvey(id as string, identity);
  const { data: isAttendee } = usePoaveyIsAttendee({
    enabled: !!id && !!walletConnected,
    args: [BigNumber.from(id ?? 0), address],
    watch: true
  })
  const { data: surveyOptions } = usePoaveyGetSurveyOptions({
    enabled: !!id,
    args: [BigNumber.from(id ?? 0)],
  });
  const { data: answers } = usePoaveyGetAnswers({
    enabled: !!id,
    args: [BigNumber.from(id ?? 0)],
    watch: true,
  })
  const {
    formState: { isValidating, isValid, errors: formErrors },
    register,
    handleSubmit,
    reset: resetForm,
  } = useForm();

  const avgAnswers = useMemo(() => {
    if (!answers || answers.length === 0) return [0, 0, 0]

    const map = answers.map((answer) => {

      const value = ethers.utils.parseBytes32String(BigNumber.from(answer).toHexString())

      return [
        value[0],
        value[1],
        value[2],
      ]
    })
    const result = [0, 0, 0]
    result[0] = map.reduce((acc, curr) => acc + Number(curr[0]), 0) / map.length
    result[1] = map.reduce((acc, curr) => acc + Number(curr[1]), 0) / map.length
    result[2] = map.reduce((acc, curr) => acc + Number(curr[2]), 0) / map.length

    return result
  }, [answers])

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
            disabled={!walletConnected || isAttendee}
            onClick={attendEvent}
            className="cursor-pointer disabled:cursor-not-allowed w-full py-3 px-4 inline-flex justify-center items-center gap-2 border border-transparent font-semibold bg-primary text-white hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all text-sm disabled:opacity-40"
          >
            {isAttendee ? 'Mint DONE' : walletConnected ? "Mint POAP" : "Need to connect wallet"}
          </button>

          <h3 className="text-xl mt-14 mb-4 font-semibold text-secondary">
            Feedback
          </h3>
          <form onSubmit={handleSubmit(async (data) => {
            await answerSurvey(data.question1, data.question2, data.question3);
            resetForm();
          })}>
            <div className="grid gap-y-4">
              <div>
                <label
                  htmlFor="question1"
                  className="cursor-pointer block text-sm mb-2"
                >
                  Question: {surveyOptions ? surveyOptions[0] : ""}
                </label>
                <div className="relative">
                  <select
                    id="question1"
                    disabled={!walletConnected || !isAttendee}
                    {...register("question1")}
                    className="py-3 px-4 pr-9 block w-full border-gray-200 border-2 text-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </select>
                  {formErrors?.question1?.type === "required" && (
                    <span className="text-red-400">This field is required</span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="question2"
                  className="cursor-pointer block text-sm mb-2"
                >
                  Question: {surveyOptions ? surveyOptions[1] : ""}
                </label>
                <div className="relative">
                  <select
                    id="question2"
                    disabled={!walletConnected || !isAttendee}
                    {...register("question2")}
                    className="py-3 px-4 pr-9 block w-full border-gray-200 border-2 text-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </select>

                  {formErrors?.question2?.type === "required" && (
                    <span className="text-red-400">This field is required</span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="question3"
                  className="cursor-pointer block text-sm mb-2"
                >
                  Question: {surveyOptions ? surveyOptions[2] : ""}
                </label>
                <div className="relative">
                  <select
                    id="question3"
                    disabled={!walletConnected || !isAttendee}
                    {...register("question3")}
                    className="py-3 px-4 pr-9 block w-full border-gray-200 border-2 text-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </select>

                  {formErrors?.question3?.type === "required" && (
                    <span className="text-red-400">This field is required</span>
                  )}
                </div>
              </div>
              <div className="mb-2"></div>

              <button
                type="submit"
                disabled={!walletConnected || !isAttendee}
                className="cursor-pointer disabled:cursor-not-allowed w-full py-3 px-4 inline-flex justify-center items-center gap-2 border border-transparent font-semibold bg-primary text-white hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all text-sm disabled:opacity-40"
              >
                {walletConnected ? (!isAttendee ? 'First, you need to mint POAP' : "Feedback Submit") : "Need to connect wallet"}
              </button>
            </div>
          </form>

          <h3 className="text-xl mt-14 mb-4 font-semibold text-secondary">
            Feedback Results
          </h3>

          <div>
            <div>
              Question: {surveyOptions ? surveyOptions[0] : ""} = {avgAnswers[0]}
            </div>
            <div>
              Question: {surveyOptions ? surveyOptions[1] : ""} = {avgAnswers[1]}
            </div>
            <div>
              Question: {surveyOptions ? surveyOptions[2] : ""} = {avgAnswers[2]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// mint button の status
// mint button の loading
// feedback button の status
// feedback button の loading
