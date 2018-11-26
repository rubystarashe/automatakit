<template>
<selector :src="$route.params.uri" :selected.sync="data" class="selector"/>
</template>

<script>
import selector from '~/components/pages/crawler/selector'

export default {
  components: {
    selector
  },
  data() {
    return {
      data: null
    }
  },
  watch: {
    data: function(n, p) {
      console.log(n)
    }
  }
}
</script>

<style>
.selector {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>