import { CallApi } from "@/CallApi/callApi";
import { createStore } from "vuex";

export default createStore({
  state: {
    products: [],
    items: [],
    images: [],
    mainProduct: [],
    isProductFetched: false,
    isMainProductFetched: false,
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    SET_ITEMS(state, items) {
      state.items = items;
    },
    SET_IMAGES(state, images) {
      state.images = images;
    },
    SET_PRODUCT_FETCHED(state) {
      state.isProductFetched = true;
    },
    SET_MAIN_PRODUCT_FETCHED(state) {
      state.isMainProductFetched = true;
    },
    SET_MAINPRODUCTS(state, mainProduct) {
      state.mainProduct = mainProduct;
    },
  },
  actions: {
    async fetchProducts({ commit, state }) {
      if (state.isProductFetched) return; // Skip API call if already fetched

      try {
        const productList: any = await CallApi.getProductList(1);
        const itemList: any = await CallApi.getItemList();
        const imageList: any = await CallApi.getImage(0);

        if (
          productList.ret === 0 &&
          itemList.ret === 0 &&
          imageList.ret === 0
        ) {
          commit("SET_PRODUCTS", productList.data);
          commit("SET_ITEMS", itemList.data);
          commit("SET_IMAGES", imageList.data);
          commit("SET_PRODUCT_FETCHED");
        }
      } catch (error) {
        commit("SET_PRODUCTS", []);
        commit("SET_ITEMS", []);
        commit("SET_IMAGES", []);
        commit("SET_FETCHED");
      }
    },
    async fetchHomePage({ commit, state }) {
      if (state.isMainProductFetched) return;
      try {
        const getMainProduct: any = await CallApi.getMainProduct();

        if (getMainProduct.ret === 0) {
          commit("SET_MAINPRODUCTS", getMainProduct.data);
          commit("SET_MAIN_PRODUCT_FETCHED");
        }
      } catch (error) {
        commit("SET_MAINPRODUCTS", []);
      }
    },
  },
});
