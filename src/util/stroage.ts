const MAIN_FILTER_SETTING = "mainEqaulizerSetting";
const AUTO_CONNECT_MEDIA = "autoConnectMedia";

interface StoreDataType {
  [MAIN_FILTER_SETTING]: Filter[];
  [AUTO_CONNECT_MEDIA]: 0 | 1;
}

export class Store {
  static async getAll(): Promise<StoreDataType> {
    const result = (await browser.storage.local.get()) as StoreDataType;
    return result;
  }
  static async get<T extends keyof StoreDataType>(
    type: T
  ): Promise<StoreDataType[T]> {
    const result = await browser.storage.local
      .get(type)
      .then((res) => res[type]);
    return result;
  }
  static async set<T extends keyof StoreDataType>(
    type: T,
    data: StoreDataType[T]
  ) {
    browser.storage.local.set({ [type]: data });
  }
}
