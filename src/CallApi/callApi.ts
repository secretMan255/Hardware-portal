import { AxiosClient } from "@/axios/axios";

type UploadImage = {
  bucket: string;
  imageName: string;
  imageBase64: string;
};

type UserLogin = {
  sub: string;
  name: string;
  email: string;
  recaptchaToken: string;
};

type SendOTP = {
  email: string;
  recaptchaToken: string;
};

type UpdatePassword = {
  email: string;
  password: string;
  otp: string;
  recaptchaToken: string;
};

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

  public static async uploadImage(FormData: UploadImage) {
    try {
      return await AxiosClient.getInstance().post("/upload/image", FormData);
    } catch (err) {
      throw err;
    }
  }

  public static async subscribe(email: string) {
    try {
      return await AxiosClient.getInstance().get(`/subscribe/?email=${email}`);
    } catch (err) {
      throw err;
    }
  }

  public static async userLogin(data: UserLogin) {
    try {
      return await AxiosClient.getInstance().post("/login/user", data);
    } catch (err) {
      throw err;
    }
  }

  public static async sendOTP(data: SendOTP) {
    try {
      return await AxiosClient.getInstance().post(`/send/opt`, data);
    } catch (err) {
      throw err;
    }
  }

  public static async updatePassword(data: UpdatePassword) {
    try {
      return await AxiosClient.getInstance().post("/reset/password", data);
    } catch (err) {
      throw err;
    }
  }
}
