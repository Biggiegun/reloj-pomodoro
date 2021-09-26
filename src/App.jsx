import React from 'react'


 export const App = () => {

        const [displayTime, setDisplayTime] = React.useState(25*60);  
        const [sessionTime, setSessionTime] = React.useState(25*60)
        const [breakTime, setBreakTime] = React.useState(5*60);  
        const [timerOn, setTimerOn] = React.useState(false);  
        const [onBreak, setOnBreak] = React.useState(false);  
        const [breakAudio, setBreakAudio] = React.useState(new     Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"));
      
      const formatTime = (time) =>{
        let minutes = Math.floor(time/60);
        let seconds = time % 60; 
        return(
          (minutes < 10 ? "0" + minutes : minutes) + 
          ":" +
          (seconds < 10 ? "0" + seconds : seconds)
        )
       
      }
      
      const changeTime = (amount, type) =>{
        if(type == 'break'){
          if(breakTime <= 60 && amount <0){
            return;
          }
          setBreakTime((prev)=> prev + amount)
        }else{
          if(sessionTime <= 60 && amount <0){
            return;
          }
          setSessionTime((prev)=> prev + amount)
          if(!timerOn){
            setDisplayTime(sessionTime + amount);
          }
        }
        
      }
      
      const controlTime = () =>{
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;
        
        if(!timerOn){
            let interval = setInterval(()=>{
              date = new Date().getTime();
              if (date > nextDate){
                  setDisplayTime((prev) => {
                    if(prev <=0 && !onBreakVariable){
                      playAudio();
                      onBreakVariable = true;
                      setOnBreak(true);
                      return breakTime;
                    }else if(prev<=0 && onBreakVariable){
                      playAudio();
                      onBreakVariable = false;
                      setOnBreak(false);
                      return sessionTime;
                    }
                    return prev - 1;
                  })
                nextDate += second;
              }
              
            }, 30)
            localStorage.clear()
          localStorage.setItem("interval-id", interval)
        }
        
        if(timerOn){
          clearInterval(localStorage.getItem("interval-id"))
        }
        setTimerOn(!timerOn)
      }
      
       const resetTime = () =>{
        setDisplayTime(25*60);
        setBreakTime(5*60);
        setSessionTime(25*60);
      }
       
       const playAudio = () =>{
         breakAudio.currentTime = 0;
         breakAudio.play();
       }
       
        return (
          <>
          <div id="break-label">
              Pomodoro Clock 
            </div>
            <div className="contenido">
            {/*<div id="session-label">Session Length</div>
            <button id="break-decrement">break-decrement</button>
            <button id="session-decrement">session-decrement</button>
            <button id="break-increment">break-increment</button>
            <button id="session-increment">session-increment</button>
            <div id="break-length"> 5 </div>
            <div id="session-length"> 25 </div>
            <div id="timer-label"> Session </div>
            <div id="time-left">  </div>*/}
            <Length 
              title={"break length"} 
              changeTime={changeTime}
              type={"break"}
              time={breakTime}
              formatTime={formatTime}
              />
              <Length 
              title={"session length"} 
              changeTime={changeTime}
              type={"session"}
              time={sessionTime}
              formatTime={formatTime}
              />
             <h1 id="timer-label">{onBreak ? "Session": "Break"}</h1>
            <div id ="time-left">{formatTime(displayTime)}</div>
            <button id="start_stop" onClick={controlTime}>      
              {timerOn?"STOP":"START"}</button>
            <button id="reset" onClick={resetTime}>reset</button>
            </div>
         </>
        
        )

    }

    const Length = ({title, changeTime, type, time, formatTime}) =>{
      return(
        <div className="contenido">
          <h3>{title}</h3>
          <div>   
            <button onClick={()=>changeTime(-60, type)}> Decrement </button>
            <h3>{formatTime(time)}</h3>
            <button onClick={()=>changeTime(60, type)}> Increment </button>
          </div>
        </div>
      );
  }
