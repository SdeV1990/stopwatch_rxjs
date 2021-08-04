// import React, { useEffect, useState } from 'react'
// import { map, Observable, Subject, concat, of, skipWhile, fromEvent } from 'rxjs'

// // Stopwatch state
// let stopwatchState = {
//     value: 0,
//     isRun: false
// }

// // Create clock stream
// const clock$ = new Observable(subscriber => {
//     setInterval( (i) => {
//         subscriber.next(i)
//     }, 1000)

// }).pipe(

//     // Emit index
//     map( (value, index) => index + 1 ),
    
// )

// // Stopwatch switch stream
// const stopwatchIsRun$ = new Subject()
// stopwatchIsRun$.subscribe(( value => console.log(value)))

// // Main stream
// const main$ = concat(clock$, of('By...')).pipe(
//     skipWhile( () => stopwatchIsRun$ === false )
// )

// const Stopwatch = () => {

//     // States
//     const [clock, setClock] = useState(0)
//     const [isRun, setIsRun] = useState(false)

//     // Use main stream
//     useEffect( () => {
    
//         // Subscribe to clock stream
//         const subscription = main$.subscribe(setClock)

//         // Undubscribe
//         return () => subscription.unsubscribe()
//     }
//     , [] )

//     // Change state and emit state in stream on stopwatch switch button click
//     const handleSwitchRunClick = (event) => {
//         setIsRun(!isRun)
//         stopwatchIsRun$.next(isRun)
//     }

//     return (
//         <>
//             <h1>{clock}</h1>
//             <button 
//                 id='stopwatch-switch-run' 
//                 onClick={handleSwitchRunClick}
//             >
//                 { isRun ? 'Stop' : 'Start' }
//             </button>
//             <button id='stopwatch-wait'>Wait</button>
//             <button id='stopwatch-reset'>Reset</button>
//         </>
//     )
// }

// export default Stopwatch;