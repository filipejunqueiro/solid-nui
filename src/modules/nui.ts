import { onCleanup, onMount } from "solid-js";
import type { SendArgs, ReceiveArgs } from "../types/events.ts";
import resourceName from "./resourceName.ts";
import inBrowser from "./inBrowser.ts";

class nui {
  static readonly _resource = resourceName();

  static async send<T = unknown, P = unknown>({
    action,
    data = {} as T,
  }: SendArgs): Promise<P> {
    if (!action.trim())
      throw new Error(`[ERROR]: Invalid or missing event name`);

    if (inBrowser()) return Promise.resolve({} as P);

    const response = await fetch(`https://${this._resource}/${action}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok)
      throw new Error(`[ERROR]: ${action}: ${response.statusText}`);

    return (await response.json()) as P;
  }

  static receive<T = unknown>({ action, callback }: ReceiveArgs): void {
    onMount(() => {
      const eventListener = (event: MessageEvent<SendArgs<T>>) => {
        const { action: eventAction, data } = event.data;

        if (eventAction === action) callback(data);
      };

      window.addEventListener("message", eventListener);

      onCleanup(() => window.removeEventListener("message", eventListener));
    });
  }
}

export default nui;
