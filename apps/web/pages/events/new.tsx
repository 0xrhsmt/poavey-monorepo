import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { ethers, BigNumber } from "ethers";
import { useForm } from "react-hook-form";
import {
  usePoaveyRegisterEvent,
  usePreparePoaveyRegisterEvent,
} from "../../libs";
import { useRouter } from "next/router";
import { useMounted } from '../../libs';
import { useAccount } from 'wagmi'

export default function EventsNewPage() {
  const { mounted } = useMounted()
  const { isConnected } = useAccount()
  const walletConnected = mounted && isConnected

  const { push } = useRouter();
  const {
    formState: { isValidating, isValid, errors: formErrors },
    register,
    handleSubmit,
    watch,
    reset: resetForm,
  } = useForm();

  const [rawEventId, question1, question2, question3] = watch(["eventId", "question1", "question2", "question3"]);
  const invalidEventId = useMemo(
    () => !!rawEventId && isNaN(rawEventId),
    [rawEventId]
  );
  const { eventId, groupId } = useMemo(
    () =>
      rawEventId && rawEventId > 0
        ? {
            eventId: BigNumber.from(rawEventId),
            groupId: ethers.BigNumber.from(ethers.utils.randomBytes(32)),
          }
        : { eventId: undefined, groupId: undefined },
    [rawEventId]
  );

  const { config, isLoading: isLoadingPrepareRegister } =
    usePreparePoaveyRegisterEvent({
      enabled: !!eventId && !!groupId,
      args: [eventId, groupId, [question1, question2, question3]],
    });
  const { isLoading: isLoadingRegister, writeAsync: registerEvent } =
    usePoaveyRegisterEvent(config);

  const onSubmit = useCallback(async () => {
    if (!eventId || !groupId || !registerEvent) return;

    try {
      const tx = await registerEvent();
      const receipt = await tx.wait();
      if (receipt.status === 0) throw new Error("Transaction failed");

      const id = receipt.logs[2].topics[1];

      resetForm();
      push(`/events/${id}`);
    } catch (error) {
      console.error(error);
    }
  }, [eventId, groupId, registerEvent, resetForm]);

  const isSubmitEnabled = useMemo(
    () => !isLoadingPrepareRegister && !isLoadingRegister && !invalidEventId,
    [isLoadingPrepareRegister, isLoadingRegister, invalidEventId]
  );

  return (
    <div className="flex flex-col items-center w-full pt-8">
      <div className="bg-white border max-w-md border-gray-200 shadow-sm">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">
              Plug-in survey function to POAP
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              you can issue POAP{" "}
              <a
                className="text-primary decoration-2 hover:underline font-medium"
                href="https://drops.poap.xyz/"
                target="_blank"
              >
                here
                <ArrowTopRightOnSquareIcon className="inline w-4 h-4 mb-0.5 ml-0.5" />
              </a>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="eventId"
                    className="cursor-pointer block text-sm mb-2"
                  >
                    POAP Event Id（number）
                  </label>
                  <div className="relative">
                    <input
                      id="eventId"
                      className="py-3 px-4 block w-full border border-gray-300 text-sm focus:border-primary focus:ring-primary"
                      disabled={isLoadingRegister}
                      {...register("eventId", {
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                      })}
                    />
                    {formErrors?.eventId?.type === "required" && (
                      <span className="text-red-400">
                        This field is required
                      </span>
                    )}
                    {formErrors?.eventId?.type === "min" && (
                      <span className="text-red-400">
                        This field is greater than 0
                      </span>
                    )}
                    {invalidEventId && (
                      <span className="text-red-400">This field is number</span>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="eventId"
                    className="cursor-pointer block text-sm mb-2"
                  >
                    Question 1.
                  </label>
                  <div className="relative">
                    <input
                      id="question1"
                      className="py-3 px-4 block w-full border border-gray-300 text-sm focus:border-primary focus:ring-primary"
                      disabled={isLoadingRegister}
                      {...register("question1", {
                        required: true,
                      })}
                    />
                    {formErrors?.question1?.type === "required" && (
                      <span className="text-red-400">
                        This field is required
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="eventId"
                    className="cursor-pointer block text-sm mb-2"
                  >
                    Question 2.
                  </label>
                  <div className="relative">
                    <input
                      id="question2"
                      className="py-3 px-4 block w-full border border-gray-300 text-sm focus:border-primary focus:ring-primary"
                      disabled={isLoadingRegister}
                      {...register("question2", {
                        required: true,
                      })}
                    />
                    {formErrors?.question2?.type === "required" && (
                      <span className="text-red-400">
                        This field is required
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="eventId"
                    className="cursor-pointer block text-sm mb-2"
                  >
                    Question 3.
                  </label>
                  <div className="relative">
                    <input
                      id="question3"
                      className="py-3 px-4 block w-full border border-gray-300 text-sm focus:border-primary focus:ring-primary"
                      disabled={isLoadingRegister}
                      {...register("question3", {
                        required: true,
                      })}
                    />
                    {formErrors?.question3?.type === "required" && (
                      <span className="text-red-400">
                        This field is required
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isSubmitEnabled || !walletConnected}
                  className="cursor-pointer disabled:cursor-not-allowed w-full py-3 px-4 inline-flex justify-center items-center gap-2 border border-transparent font-semibold bg-primary text-white hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all text-sm disabled:opacity-40"
                >
                  {walletConnected ? isLoadingPrepareRegister ? "Loading..." : "Plug In" : 'Need to connect wallet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
