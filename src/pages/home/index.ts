import Vue from "vue";

new Vue({
  data() {
    return {
      counter: 0,
    };
  },

  methods: {
    increase() {
      this.counter++;
    },
  },
}).$mount("#app");
