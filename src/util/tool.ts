export function hzToTitle(hz: number) {
  if (hz >= 1000) {
    return `${hz / 1000}K HZ`;
  } else {
    return `${hz} HZ`;
  }
}
export async function getCurrentTabs() {
  return await browser.tabs.query({ active: true, currentWindow: true });
}

export async function sendMessageToCurrentTabs<T extends NotifyType>(type: T, data: MsgToFormat[T]) {
  const tabs = await getCurrentTabs();
  if (tabs[0].id !== undefined) browser.tabs.sendMessage(tabs[0].id, { type, data });
}

export async function sendMessageToEuqalizer<T extends NotifyType>(type: T, data: MsgToFormat[T]) {
  browser.runtime.sendMessage({ type, data });
}
