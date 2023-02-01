<template>
  <div>
    <p>Type to search Wikipedia</p>
    <input v-model="search">
    <button v-stream:click="{ subject: setLimit$, data: 10 }">10</button>
    <button v-stream:click="{ subject: setLimit$, data: 5 }">5</button>

<!--    <button @click="setLimit(20)">20</button>-->
    <div v-if="results">
      <h1>{{ results.term }}</h1>
      <ol class="result" v-if="results.matches.length">
        <li class="result__item" v-for="match in results.matches" :key="match.id">
          <a :href="match.url">{{ match.title }}</a>
          <p>{{ match.description }}</p>
        </li>
      </ol>
      <p v-else>
        No matches found.
      </p>
    </div>
  </div>
</template>
<script>
import {
  pluck,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  tap,
  startWith,
  of,
  mergeWith,
  mergeAll,
  zipWith,
  mergeMap,
  combineLatestWith,
  combineAll,
  combineLatestAll,
  merge,
  mapTo, catchError, EMPTY,
} from "rxjs";
import { ajax } from 'rxjs/ajax';
// import {fromFetch} from 'rxjs/fetch';
// CORS
// const baseUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*';
const baseUrl = '/wiki/w/api.php';


export default {
  name: 'About',
  data() {
    return {
      showParam:'',
      search: '',
      param: {
        action: 'opensearch',
        format: 'json',
        origin: '*',
        limit: 20,
      }
    };
  },
  watch:{
    param: {
      handler(newval, oldval){
        console.log('handle', newval, oldval);
        // do stuff
      },
      deep: true,
      immediate:true,
    }
  },
  // declare dom stream Subjects
  domStreams: ['setLimit$',],
  subscriptions() {
    return {
      // this is the example in RxJS's readme.
      // results: this.$watchAsObservable('search').pipe(
      //     pluck('newValue'),
      //     tap((data) => console.log('pluck', data)),
      //     filter(text => text.length > 2),
      //     tap((data) => console.log('filter', data)),
      //     debounceTime(500),
      //     tap((data) => console.log('debounceTime', data)),
      //     distinctUntilChanged(),
      //     tap((data) => console.log('distinctUntilChanged', data)),
      //     switchMap(()=>this.urlParams$, (search, otherParams)=>`search=${search}&${otherParams}`),
      //     tap(console.log),
      //     switchMap(this.fetchData),
      //     tap(console.log),
      //     map(this.formatResult)
      // ),
      results: this.$watchAsObservable('search').pipe(
          pluck('newValue'),
          filter(text => text.length > 2),
          debounceTime(500),
          distinctUntilChanged(),
          tap(console.log),
          switchMap(()=>this.limit$, (search, limit)=>`search=${search}&limit=${limit}`),
          tap(console.log),
          switchMap(()=>this.urlParams$, (preQueryString, otherParams)=>`${preQueryString}&${otherParams}`),
          tap(console.log),
          switchMap(this.fetchData),
          catchError(error=>{
            console.log(error);
            alert('err');
            return EMPTY;
          }),
          map(this.formatResult)
      ),
      limit$: this.setLimit$.pipe(
          startWith({data: 5}),
          pluck('data'),
          tap((val)=> {
            this.param.limit = val;
          }),
          tap(console.log),
          map((val) => of(val)),
      ),
      urlParams$: this.$watchAsObservable('param', {immediate: true, deep: true}).pipe(
          startWith({
            ...this.param
          }),
          // startWith(`${baseUrl}?action=${this.param.action}&format=${this.param.format}&limit=${this.param.limit}&origin=${this.param.origin}`),
          debounceTime(100),
          pluck('newValue'),
          tap(console.log),
          tap((val)=>this.showParam = `action=${val.action}&format=${val.format}&origin=${val.origin}`),
          // tap(console.log),
          map((val)=>of(`action=${val.action}&format=${val.format}&origin=${val.origin}`)),
          //map(()=>`${baseUrl}?action=${val.action}&format=${val.format}&limit=${val.limit}&origin=${val.origin}`),
      ),
    }
  },
  methods: {
    fetchData(params) {
      // return fromFetch(`${baseUrl}?${params}`);
      console.log(params);
      return ajax.getJSON(`${baseUrl}?${params}`);
    },
    formatResult(res) {
      console.log(res);
      return {
        term: res[0],
        matches: res[1].map((title, i) => ({
          title: title,
          description: res[2][i],
          url: res[3][i]
        }))
      }
    },
    setLimit(limit) {
      this.param.limit=parseInt(limit, 10);
      // console.log(this.param.limit);
    },
  }
}
</script>
<style scoped>
.result {
}
</style>