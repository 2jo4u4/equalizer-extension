export function hzToTitle(hz: number) {
    if (hz >= 1000) {
        return `${hz / 1000}K HZ`
    } else {
        return `${hz} HZ`
    }
}
export async function getCurrentTabs() {
    return await browser.tabs.query({ active: true, currentWindow: true });
}

export async function sendMessageToCurrentTabs<T extends NotifyType>(type: T, data: MsgToFormat[T]) {
    const tabs = await getCurrentTabs()
    browser.tabs.sendMessage(tabs[0].id ?? 0, { type, data });
}

export async function sendMessageToEuqalizer<T extends NotifyType>(type: T, data: MsgToFormat[T]) {
    browser.runtime.sendMessage({ type, data })
}

export class StorageCtrl {
    static async get() {
        const result = await browser.storage.local.get("eqaulizer-setting") as { "eqaulizer-setting"?: Filter[] }
        return result
    }
    static async set(filter?: Filter[]) {
        browser.storage.local.set({ "eqaulizer-setting": filter })
    }
}