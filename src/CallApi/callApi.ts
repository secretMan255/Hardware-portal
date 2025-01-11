import { AxiosClient } from "@/axios/axios";

export class CallApi {
  private static Instance: CallApi;

  private constructor() {}

  public static getInstance(): CallApi {
    if (!this.Instance) {
      this.Instance = new CallApi();
    }

    return this.Instance;
  }

  public static async getHalo() {
    try {
      return await AxiosClient.getInstance()?.get("/home");
    } catch (err) {
      throw err;
    }
  }

  public static async getProductList(status: number) {
    try {
      return await AxiosClient.getInstance()?.get(`/products?status=${status}`);
    } catch (err) {
      throw err;
    }
  }

  public static async getItemList() {
    try {
      return await AxiosClient.getInstance().get("/items");
    } catch (err) {
      throw err;
    }
  }

  public static async getImage(path: string, fileName: string) {
    try {
      return await AxiosClient.getInstance().get(
        `/image?path=${path}&fileName=${fileName}`,
        { responseType: "blob" }
      );
    } catch (err) {
      throw err;
    }
  }
}
