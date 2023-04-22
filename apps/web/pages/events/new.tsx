import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect, createClient } from "wagmi";
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

    reset
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

  const { config, isLoading: isLoadingPrepareRegister } = usePreparePoaveyRegisterEvent({
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
      reset()
    } catch (error) {
      console.error(error);
    }
  }, [eventId, groupId, registerEvent, reset]);

  const isSubmitEnabled = useMemo(
    () => !isLoadingRegister && !isValidating && isValid && registerEvent,
    [isValid, isValidating, isLoadingRegister, registerEvent]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* include validation with required or other standard HTML validation rules */}
      <input
        disabled={isLoadingRegister}
        {...register("eventId", {
          required: true,
          valueAsNumber: true,
          min: 1,
        })}
      />
      {/* errors will return when field validation fails  */}
      {formErrors.eventId && <span>This field is required</span>}

      <button disabled={!isSubmitEnabled} type="submit">
        { isLoadingPrepareRegister ? 'Loading...' : 'Submit' }
      </button>
    </form>
  );
}
