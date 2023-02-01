<template>
  <div class="home">
<!--    <img alt="Vue logo" src="../assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->

    <div>{{ count }}</div>

    <!-- simple usage -->
    <button v-stream:click="plus$">Add on Click</button>

    <button v-stream:click="{ subject: plus$, data: minusDelta1, options:{once:true} }">Add on Click (Option once:true)</button>

    <!-- you can also stream to the same subject with different events/data -->
    <button
        v-stream:click="{ subject: minus$, data: minusDelta1 }"
        v-stream:mousemove="{ subject: minus$, data: minusDelta2 }">
      Minus on Click &amp; Mousemove
    </button>

    <pre>{{ $data }}</pre>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import {map, merge, pluck, scan, startWith} from "rxjs";

export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  data () {
    return {
      minusDelta1: -1,
      minusDelta2: -1
    }
  }, // declare dom stream Subjects
  domStreams: ['plus$', 'minus$'],
  subscriptions () {
    return {
      count: merge(
          this.plus$.pipe(map(() => 1)),
          this.minus$.pipe(pluck('data'))
      ).pipe(
          startWith(0),
          scan((total, change) => total + change)
      )
    }
  }
}
</script>
