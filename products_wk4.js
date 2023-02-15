import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js";
import pagination from "./pagination.js";

const url = "https://vue3-course-api.hexschool.io/";
const api_path = "pss940909";

// 全域都需要使用到modal所以宣告在外層
let productModal = {};
let delProductModal = {};

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false, // 確認是編輯或新增所使用
      page: {}, // 儲存分頁資料
    };
  },
  methods: {
    getProducts(page = 1) {
      // 參數預設值：預設帶入第一頁的資料
      axios
        .get(`${url}/v2/api/${api_path}/admin/products/?page=${page}`) // 用參數page去決定要帶出哪一頁產品分頁的資料
        .then((res) => {
          console.log(res.data);
          console.log(res.data.products);
          this.products = res.data.products;
          this.page = res.data.pagination; // 儲存分頁資料
          console.log(this.products);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openModal(status, product) {
      console.log(status);
      // 用參數status判斷是要新增還是要修改
      if (status === "create") {
        productModal.show();
        this.isNew = true;
        // 帶入初始化資料
        this.tempProduct = {
          imagesUrl: [],
        };
      } else if (status === "edit") {
        console.log("ok");
        productModal.show();
        this.isNew = false;
        // 會帶入當前要編輯的資料
        this.tempProduct = { ...product };
        console.log(this.tempProduct);
      } else if (status === "delete") {
        delProductModal.show();
        this.tempProduct = { ...product };
        // 等等取id使用
      }
    },
    updateProduct() {
      let link = `${url}/v2/api/${api_path}/admin/product`;
      // 用isNew判斷api要怎麼運行
      let method = "post";
      if (!this.isNew) {
        link = `${url}/v2/api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }
      axios[method](link, {
        data: this.tempProduct,
      })
        .then((res) => {
          this.getProducts(); // 新增完產品後要重新取得產品列表
          // 要放在then之後才會加上新增的產品
          productModal.hide();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteProduct() {
      const link = `${url}/v2/api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios.delete(link).then((res) => {
        console.log(res.data);
        this.getProducts();
        delProductModal.hide();
      });
    },
    // 如果多圖陣列原先不存在 新增多圖陣列
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  components: {
    pagination,
  },
  mounted() {
    let myCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)myCookie\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // 1. 驗證是否已登入 => 取出儲存的cookie

    // 2. axios header => 之後傳出axios請求 headers預設都會帶上token
    axios.defaults.headers.common["Authorization"] = myCookie;
    this.getProducts();

    // Bootstrap 方法
    // 1. 初始化 new
    // 2. 呼叫方法 show hide
    productModal = new bootstrap.Modal("#productModal");
    // productModal.show(); // 確保會動
    delProductModal = new bootstrap.Modal("#delProductModal");
  },
});
app.component("product-modal", {
  props: ["tempProduct", "updateProduct", "isNew"],
  template: "#product-modal-template",
});
app.mount("#app");
