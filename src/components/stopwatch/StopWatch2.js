import React, { useEffect, useState } from 'react'
import { fromEvent, interval, merge, noop, NEVER, Subject } from "rxjs";
import { map, mapTo, scan, startWith, switchMap, tap, buffer, filter, debounceTime } from "rxjs/operators";

const getElem = (id) => document.getElementById(id);

// Custom RxJS functions - will be provided by separate module 'CustomRxJS'
const fromClick = (id) => fromEvent(getElem(id), 'click');
const fromClickAndMapTo = (id, obj) => fromClick(id).pipe(mapTo(obj));
const fromDoubleClickAndMapTo = (id, obj, time) => fromClick(id).pipe(
  buffer(fromClick(id).pipe(debounceTime(time))),
  map(clicks => clicks.length),
  filter(clicksLength => clicksLength >= 2),
  mapTo(obj)
);

// Count controllers
const getVal = (id) => parseInt(getElem(id)['value']);
const setValue = (val) => (getElem('counter').innerText = val.toString());

// RxJS and React connect
const useObservable = observable => {
  const [state, setState] = useState();

  useEffect(() => {
    const sub = observable.subscribe(setState);
    return () => sub.unsubscribe();
  }, [observable] );

  return state;
};

// Events
// const start$ = new Subject();
// const pause$ = new Subject();
// const reset$ = new Subject();
// const pauseHandled$ = pause$.pipe(
//   pause$.pipe(debounceTime(300)),
//   map( clicks => clicks.length ),
//   filter(clicksLength => clicksLength >= 2),
//   mapTo({ count: false })
// );

const Stopwatch2 = () => {
  
  useEffect(( _ =>{
    
    // Events
    const start$ = fromClickAndMapTo('start', { count: true });
    const pause$ = fromDoubleClickAndMapTo('pause', { count: false }, 300);
    const reset$ = fromClickAndMapTo('reset', { value: 0 })
    
    // pause$.pipe(
    //   pause$.pipe(debounceTime(300)),
    //   map( clicks => clicks.length ),
    //   filter(clicksLength => clicksLength >= 2),
    //   mapTo({ count: false })
    // );
    
    // Create stream by merging subjects
    const events$ = merge( start$, pause$, reset$ );

    // Reaction on stream
    const stopWatch$ = events$.pipe(
      startWith({
        count: false,
        value: 0,
      }),
      scan( (state, curr) => ({ ...state, ...curr }), {} ),
      tap( (state) => setValue(state.value) ),
      switchMap( (state) =>
        state.count
          ? interval(1000).pipe(
              tap( _ => state.value += 1 ),
              tap( _ => setValue(state.value) ),
            )
          : NEVER
      ),
    );

    // Start
    stopWatch$.subscribe();
    
    // const componentState = useObservable(events$);
    
  }), [])
  
  return (
    <>
      <div id="counter">0</div>
      <div id="controls">
        <fieldset>
          <legend>Controls</legend>
          <button id="start" >Start</button>
          <button id="pause" >Wait</button>
          <button id="reset" >Reset</button>
        </fieldset>
      </div>
    </>
  )
}

export default Stopwatch2;