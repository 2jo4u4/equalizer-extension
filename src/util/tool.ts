export function hzToTitle(hz: number) {
  if (hz >= 1000) {
    return `${hz / 1000}K HZ`;
  } else {
    return `${hz} HZ`;
  }
}
export async function getCurrentTabs() {
  try {
    return await browser.tabs.query({ active: true, currentWindow: true });
  } catch (e) {
    return undefined;
  }
}

export async function sendMessageToCurrentTabs<T extends NotifyType>(type: T, data: MsgToFormat[T]) {
  const tabs = await getCurrentTabs();
  if (tabs !== undefined && tabs[0].id !== undefined) browser.tabs.sendMessage(tabs[0].id, { type, data });
}

export async function sendMessageToEuqalizer<T extends NotifyType>(type: T, data: MsgToFormat[T]) {
  browser.runtime.sendMessage({ type, data });
}

export function cloneFilters(f: Filters): Filters {
  const clone: Filters = [];
  f.forEach((o, index) => {
    clone[index] = cloneFilter(o);
  });
  return clone;
}

export function cloneFilter({ hz, q, gain, type }: Filter): Filter {
  return { hz, q, gain, type };
}
