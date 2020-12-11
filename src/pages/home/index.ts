import Vue from 'vue';

new Vue({
  data() {
    return {
      counter: 0,
    };
  },

  methods: {
    increase() {
      this.counter += 1;
    },
  },
}).$mount('#app');
