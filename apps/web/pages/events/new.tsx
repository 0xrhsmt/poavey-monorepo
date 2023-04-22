import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { ethers, BigNumber } from "ethers";
import { useForm } from "react-hook-form";
import {
  usePoaveyRegisterEvent,
  usePreparePoaveyRegisterEvent,
} from "../../libs";
import { useRouter } from "next/router";

export default function EventsNewPage() {
  const { push } = useRouter();
  const {
    formState: { isValidating, isValid, errors: formErrors },
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm();

  const _eventId = watch("eventId");
  const { eventId, groupId } = useMemo(
    () =>
      _eventId && _eventId > 0
        ? {
            eventId: BigNumber.from(_eventId),
            groupId: ethers.BigNumber.from(ethers.utils.randomBytes(32)),
          }
        : { eventId: undefined, groupId: undefined },
    [_eventId]
  );

  const { config, isLoading: isLoadingPrepareRegister } =
    usePreparePoaveyRegisterEvent({
      enabled: !!eventId,
      args: [eventId, groupId],
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

      push(`/events/${id}`);
      reset();
    } catch (error) {
      console.error(error);
    }
  }, [eventId, groupId, registerEvent, reset]);

  const isSubmitEnabled = useMemo(
    () => !isLoadingRegister && !isValidating && isValid && registerEvent,
    [isValid, isValidating, isLoadingRegister, registerEvent]
  );

  return (
    <div className="flex flex-col items-center w-full pt-8">
      <div className="bg-white border max-w-md border-gray-200 rounded-xl shadow-sm">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">
              Plug-in survey function to POAPs
            </h1>
            <p className="mt-2 text-sm text-gray-600">
               you can issue POAPs&nbsp;
              <a
                className="text-primary decoration-2 hover:underline font-medium"
                href="https://drops.poap.xyz/"
                target="_blank"
              >
                here
                <ArrowTopRightOnSquareIcon className="inline w-4 h-4 mb-0.5 ml-0.5"/>
              </a>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-y-4">
                <div>
                  <label htmlFor="eventId" className="cursor-pointer block text-sm mb-2">
                    POAP Event Id
                  </label>
                  <div className="relative">
                    <input
                      id="eventId"
                      className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-primary focus:ring-primary"
                      disabled={isLoadingRegister}
                      {...register("eventId", {
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                      })}
                    />
                    {formErrors.eventId && <span>This field is required</span>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isSubmitEnabled}
                  className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-primary text-white hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all text-sm"
                >
                  {isLoadingPrepareRegister ? "Loading..." : "Plug In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
