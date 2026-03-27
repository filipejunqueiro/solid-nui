import { createResource, createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type { ISendArgs, IReceiveArgs, ITrigger, IEventPayload } from "../types/events.ts";
import resourceName from "./resourceName.ts";
import inBrowser from "./inBrowser.ts";

class nui {
  static readonly _resource = resourceName();

  /**
   * Sends a NUI event to the client and returns a reactive data resource.
   *
   * In the browser, if `mockData` is provided, it will return it otherwise, it will return `undefined`.
   *
   * @template TSend - The type of the payload sent with the trigger
   * @template TResponse - The type of the resonse returned by the client
   *
   * @param action - The name of the NUI event to send.
   * @param mockData - The optional mock data returned in the browser enviroment instead of a real fetch.
   *
   * @returns An object containing:
   * - `trigger` - A function to fire the event with an optional typed payload.
   * - `data` - A SolidJS resource that reactively holds the response.
   *
   * @throws {Error} if `action` contains whitespaces or is empty
   *
   * @example
   * const { trigger, data } = nui.send<{ amount: number }, { success: boolean }>({
   *  action: "giveMoney",
   *  mockData: { amount: 1000 }
   * });
   *
   * trigger({ amount: 100 });
   * console.log(data());
   */
  static send<TSend = unknown, TResponse = unknown>({ action, mockData }: ISendArgs<TSend>) {
    if (!action.trim()) throw new Error(`[ERROR]: Invalid or missing event name`);

    const [trigger, setTrigger] = createSignal<ITrigger<TSend> | undefined>(undefined);

    const [data] = createResource(trigger, async ({ data }) => {
      if (inBrowser()) {
        if (mockData !== undefined) return mockData;
        return undefined;
      }

      const response = await fetch(`https://${this._resource}/${action}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`[ERROR]: ${action}: ${response.statusText}`);

      return (await response.json()) as TResponse;
    });

    return {
      trigger: (data?: TSend) => setTrigger({ id: createUniqueId(), data: data }),
      data,
    };
  }

  /**
   * Listens for a NUI event posted from the client and invokes a callback with the typed payload.
   *
   * Registers a `message` event listener on `window` when the component mounts,
   * and automatically removes it when the component is disposed.
   *
   * > **Note:** Must be called within a SolidJS reactive context.
   *
   * @template TData - The type of the data received from the client event.
   *
   * @param action - The name of the NUI event to listen for.
   * @param callback - A function invoked with the typed data when the event is received.
   *
   * @example
   * nui.receive<boolean>({
   *  action: "visibility",
   *  callback: (visible) => setVisibility(visible),
   * });
   */
  static receive<TData = unknown>({ action, callback }: IReceiveArgs<TData>): void {
    onMount(() => {
      const eventListener = (event: MessageEvent<IEventPayload<TData>>) => {
        const { action: eventAction, data } = event.data;

        if (eventAction === action) callback(data);
      };

      window.addEventListener("message", eventListener);

      onCleanup(() => window.removeEventListener("message", eventListener));
    });
  }
}

export default nui;
