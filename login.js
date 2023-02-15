import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js";

const url = "https://vue3-course-api.hexschool.io/";
const api_path = "pss940909";

const app = {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      console.log(this.user);
      axios
        .post(`${url}v2/admin/signin`, this.user)
        .then((res) => {
          console.log(res.data);
          const { token, expired } = res.data;
          document.cookie = `myCookie=${token}; expires=${expired}`;
          console.log(token, expired);
          window.location = "./week2.html";
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    console.log("mounted");
    console.log(`${url}/v2/admin/signin`);
  },
};

createApp(app).mount("#app");
