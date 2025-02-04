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

type CreateAccount = {
  email: string;
  name: string;
  password: string;
  phone: number;
  address: string;
  postCode: number;
  city: string;
  country: string;
  otp: string;
  recaptchaToken: string;
};

type CreateAccountOTP = {
  email: string;
  recaptchaToken: string;
};

type CheckoutType = {
  userId: number;
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

  public static async getImage(id: number) {
    try {
      return await AxiosClient.getInstance().get(`image/?id=${id}`);
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

  public static async sendResetPasswordOTP(data: SendOTP) {
    try {
      return await AxiosClient.getInstance().post(`/send/reset/otp`, data);
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

  public static async sendCreateAccountOTP(data: CreateAccountOTP) {
    try {
      return await AxiosClient.getInstance().post("/send/verify/otp", data);
    } catch (err) {
      throw err;
    }
  }

  public static async createAccount(data: CreateAccount) {
    try {
      return await AxiosClient.getInstance().post("/create/account", data);
    } catch (err) {
      throw err;
    }
  }

  public static async getCityItem(status: number) {
    try {
      return await AxiosClient.getInstance().get(`/state/?status=${status}`);
    } catch (err) {
      throw err;
    }
  }

  public static async editAccount(data: any) {
    try {
      return await AxiosClient.getInstance().post("/edit/account", data);
    } catch (err) {
      throw err;
    }
  }

  public static async getCart(userId: number) {
    try {
      return await AxiosClient.getInstance().get(`/cart/?id=${userId}`);
    } catch (err) {
      throw err;
    }
  }

  public static async addItemToCart(data: any) {
    try {
      return await AxiosClient.getInstance().post("/edit/cart/add", data);
    } catch (err) {
      throw err;
    }
  }

  public static async minusItemFromCart(data: any) {
    try {
      return await AxiosClient.getInstance().post("/edit/cart/minus", data);
    } catch (err) {
      throw err;
    }
  }

  public static async removeItemFromCart(data: any) {
    try {
      return await AxiosClient.getInstance().post("/edit/cart/remove", data);
    } catch (err) {
      throw err;
    }
  }

  public static async getMainProduct() {
    try {
      return await AxiosClient.getInstance().get("/products/main");
    } catch (err) {
      throw err;
    }
  }

  public static async checkoutPending(data: CheckoutType) {
    try {
      return await AxiosClient.getInstance().post(`/checkout/pending`, data);
    } catch (err) {
      throw err;
    }
  }

  public static async deleteCheckout(data: CheckoutType) {
    try {
      return await AxiosClient.getInstance().post("/checkout/delete", data);
    } catch (err) {
      throw err;
    }
  }
}
