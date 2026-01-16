var x=Object.defineProperty;var I=(r,e,t)=>e in r?x(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var c=(r,e,t)=>I(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();const D="modulepreload",$=function(r){return"/"+r},T={},E=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=Promise.allSettled(t.map(l=>{if(l=$(l),l in T)return;T[l]=!0;const d=l.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${m}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":D,d||(u.as="script"),u.crossOrigin="",u.href=l,o&&u.setAttribute("nonce",o),document.head.appendChild(u),d)return new Promise((h,p)=>{u.addEventListener("load",h),u.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&i(o.reason);return e().catch(i)})},w={id:"A",name:"Push Day",exercises:[{id:"bench_press",name:"Bench Press",targetSets:4,restSeconds:120},{id:"incline_press",name:"Incline Press",targetSets:3,restSeconds:90},{id:"tricep_dips",name:"Tricep Dips",targetSets:3,restSeconds:60}],createdAt:Date.now()},L={id:"B",name:"Leg Day",exercises:[{id:"squats",name:"Squats",targetSets:4,restSeconds:180},{id:"deadlifts",name:"Deadlifts",targetSets:3,restSeconds:180},{id:"leg_press",name:"Leg Press",targetSets:3,restSeconds:90}],createdAt:Date.now()},b={A:w,B:L};function A(r,e){const t=b[r];return{id:`session_${r}_${e}`,planId:r,date:e,performances:t.exercises.map(n=>({exerciseId:n.id,sets:[],feeling:null})),completedAt:Date.now()}}function B(r,e,t){return{...r,sets:[...r.sets,{weight:e,reps:t,timestamp:Date.now()}]}}function C(r,e){return{...r,feeling:e}}function P(r){return{date:r,meal1:!1,meal2:!1,shake:!1,notes:"",loggedAt:Date.now()}}function M(r){return{...r,meal1:!r.meal1}}function F(r){return{...r,meal2:!r.meal2}}function O(r){return{...r,shake:!r.shake}}function _(r,e){return{...r,notes:e}}function y(r){return r.meal1&&r.meal2&&r.shake}function W(r){var n;const e=r.filter(y).length,t=r.length;return{week:H(new Date(((n=r[0])==null?void 0:n.date)||new Date)),totalDays:t,completeDays:e,averageCompletion:t>0?e/t:0}}function H(r){const e=new Date(r);e.setHours(0,0,0,0),e.setDate(e.getDate()+4-(e.getDay()||7));const t=new Date(e.getFullYear(),0,1),n=Math.ceil(((e.getTime()-t.getTime())/864e5+1)/7);return`${e.getFullYear()}-W${String(n).padStart(2,"0")}`}function z(r){const e=new Date(r),t=[];e.setDate(e.getDate()-e.getDay()+1);for(let n=0;n<7;n++)t.push(e.toISOString().split("T")[0]),e.setDate(e.getDate()+1);return t}const S={TRAINING_SESSIONS:"fitness_training_sessions",NUTRITION:"fitness_nutrition"};class R{saveTrainingSession(e){const t=this.getAllTrainingSessions(),n=t.findIndex(s=>s.id===e.id);n>=0?t[n]=e:t.push(e),localStorage.setItem(S.TRAINING_SESSIONS,JSON.stringify(t))}getAllTrainingSessions(){const e=localStorage.getItem(S.TRAINING_SESSIONS);return e?JSON.parse(e):[]}getTrainingSessionByDate(e){return this.getAllTrainingSessions().find(n=>n.date===e)||null}getTodaySession(){return this.getTrainingSessionByDate(this.getTodayString())}saveDailyNutrition(e){const t=this.getAllNutrition(),n=t.findIndex(s=>s.date===e.date);n>=0?t[n]=e:t.push(e),localStorage.setItem(S.NUTRITION,JSON.stringify(t))}getAllNutrition(){const e=localStorage.getItem(S.NUTRITION);return e?JSON.parse(e):[]}getNutritionByDate(e){return this.getAllNutrition().find(n=>n.date===e)||null}getNutritionForWeek(e){const t=this.getAllNutrition(),n=this.getWeekDates(e);return t.filter(s=>n.includes(s.date))}getExerciseStats(e){var u;const n=this.getAllTrainingSessions().flatMap(h=>h.performances).filter(h=>h.exerciseId===e);if(n.length===0)return{exerciseId:e,exerciseName:this.getExerciseNameById(e),lastWeight:null,lastDate:null,trend:"stable",sessionCount:0};const s=n.sort((h,p)=>{var f,k;return(((f=p.sets[p.sets.length-1])==null?void 0:f.timestamp)||0)-(((k=h.sets[h.sets.length-1])==null?void 0:k.timestamp)||0)}),i=s[0],a=Math.max(...i.sets.map(h=>h.weight)),o=new Date((u=i.sets[i.sets.length-1])==null?void 0:u.timestamp).toISOString().split("T")[0];let l="stable";if(s.length>1){const h=s.slice(1,6).reduce((p,f)=>{const k=Math.max(...f.sets.map(N=>N.weight));return p+k},0)/Math.min(5,s.length-1);a>h*1.02?l="up":a<h*.98&&(l="down")}let d=null;if(s.length>1){const h=s[1];d=Math.max(...h.sets.map(p=>p.weight))}const m=d!==null?a-d:null;return{exerciseId:e,exerciseName:this.getExerciseNameById(e),lastWeight:a,previousWeight:d,weightDelta:m,lastDate:o,trend:l,sessionCount:n.length}}getTodayString(){const e=new Date,t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${s}`}getWeekDates(e){const t=new Date(e),n=[];t.setDate(t.getDate()-t.getDay()+1);for(let s=0;s<7;s++)n.push(t.toISOString().split("T")[0]),t.setDate(t.getDate()+1);return n}getExerciseNameById(e){for(const t of Object.values(b)){const n=t.exercises.find(s=>s.id===e);if(n)return n.name}return e}getLastPerformanceForPlan(e,t){const s=this.getAllTrainingSessions().filter(i=>i.planId===t).sort((i,a)=>new Date(a.date).getTime()-new Date(i.date).getTime());if(s.length===0)return{maxWeight:null,maxReps:null,lastDate:null};for(const i of s){const a=i.performances.find(o=>o.exerciseId===e);if(a&&a.sets.length>0){let o=0,l=0;return a.sets.forEach(d=>{d.weight>o&&(o=d.weight,l=d.reps)}),{maxWeight:o,maxReps:l,lastDate:i.date}}}return{maxWeight:null,maxReps:null,lastDate:null}}clearAllData(){localStorage.removeItem(S.TRAINING_SESSIONS),localStorage.removeItem(S.NUTRITION)}}const v=new R;class U{constructor(){c(this,"listeners",new Set);c(this,"currentTrainingSession",null);c(this,"currentNutrition",null);this.initialize()}initialize(){const e=new Date,t=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;this.currentTrainingSession=v.getTodaySession(),this.currentNutrition=v.getNutritionByDate(t),this.currentNutrition||(this.currentNutrition=P(t))}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e())}startTrainingSession(e){const t=new Date,n=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;this.currentTrainingSession=A(e,n),this.saveTraining()}addSet(e,t,n){if(!this.currentTrainingSession){console.error("No active training session");return}const s=this.currentTrainingSession.performances.findIndex(i=>i.exerciseId===e);s<0||(this.currentTrainingSession.performances[s]=B(this.currentTrainingSession.performances[s],t,n),this.saveTraining())}setExerciseFeeling(e,t){if(!this.currentTrainingSession)return;const n=this.currentTrainingSession.performances.findIndex(s=>s.exerciseId===e);n<0||(this.currentTrainingSession.performances[n]=C(this.currentTrainingSession.performances[n],t),this.saveTraining())}saveTraining(){this.currentTrainingSession&&v.saveTrainingSession(this.currentTrainingSession),this.notify()}toggleMeal1(){this.currentNutrition&&(this.currentNutrition=M(this.currentNutrition),this.saveNutrition())}toggleMeal2(){this.currentNutrition&&(this.currentNutrition=F(this.currentNutrition),this.saveNutrition())}toggleShake(){this.currentNutrition&&(this.currentNutrition=O(this.currentNutrition),this.saveNutrition())}setNutritionNotes(e){this.currentNutrition&&(this.currentNutrition=_(this.currentNutrition,e),this.saveNutrition())}saveNutrition(){this.currentNutrition&&v.saveDailyNutrition(this.currentNutrition),this.notify()}resetAll(){v.clearAllData(),this.currentTrainingSession=null,this.currentNutrition=null,this.notify()}}const g=new U;class G{constructor(e){c(this,"container");c(this,"onPlanSelectedCallback");c(this,"onBackCallback");this.container=e}render(){this.container.innerHTML="";const e=b.A,t=b.B,n=`
      <div class="screen select-plan-screen">
        <div class="screen-header">
          <h1>💪 Trainingsplan wählen</h1>
          <p>Welcher Plan ist heute dran?</p>
        </div>

        <div class="plan-cards">
          <!-- PLAN A -->
          <div class="plan-card" id="plan-a-card">
            <div class="plan-header">
              <div class="plan-title">Plan A</div>
              <div class="plan-emoji">🏋️</div>
            </div>
            <div class="plan-name">${e.name}</div>
            <div class="plan-description">Push Fokus</div>
            
            <div class="plan-exercises">
              ${e.exercises.map(s=>`<div class="exercise-item">• ${s.name} (${s.targetSets} Sets)</div>`).join("")}
            </div>

            <button class="btn btn-primary" id="btn-plan-a">
              Plan A Starten
            </button>
          </div>

          <!-- PLAN B -->
          <div class="plan-card" id="plan-b-card">
            <div class="plan-header">
              <div class="plan-title">Plan B</div>
              <div class="plan-emoji">🦵</div>
            </div>
            <div class="plan-name">${t.name}</div>
            <div class="plan-description">Bein Fokus</div>
            
            <div class="plan-exercises">
              ${t.exercises.map(s=>`<div class="exercise-item">• ${s.name} (${s.targetSets} Sets)</div>`).join("")}
            </div>

            <button class="btn btn-primary" id="btn-plan-b">
              Plan B Starten
            </button>
          </div>
        </div>

        <div class="navigation">
          <button id="back-btn" class="btn">← Zurück</button>
        </div>
      </div>
    `;this.container.innerHTML=n,this.attachEventListeners()}attachEventListeners(){var e,t,n;(e=document.getElementById("btn-plan-a"))==null||e.addEventListener("click",()=>this.onSelectPlan("A")),(t=document.getElementById("btn-plan-b"))==null||t.addEventListener("click",()=>this.onSelectPlan("B")),(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>{var s;return(s=this.onBackCallback)==null?void 0:s.call(this)})}onSelectPlan(e){var t;(t=this.onPlanSelectedCallback)==null||t.call(this,e)}}class j{constructor(e,t,n){c(this,"container");c(this,"session");c(this,"currentExerciseIndex",0);c(this,"repository");c(this,"onAddSetCallback");c(this,"onSetFeelingCallback");c(this,"onFinishCallback");c(this,"onHomeCallback");this.container=e,this.session=t,this.repository=n}render(){this.container.innerHTML="";const e=b[this.session.planId],t=e.exercises[this.currentExerciseIndex],n=this.session.performances[this.currentExerciseIndex],s=n.sets.map((l,d)=>`<div class="set-item">Set ${d+1}: ${l.weight}kg × ${l.reps} reps</div>`).join(""),i=this.currentExerciseIndex>0?'<button id="prev-exercise-btn" class="btn">← Zurück</button>':"",a=this.currentExerciseIndex<e.exercises.length-1?'<button id="next-exercise-btn" class="btn btn-success">Weiter →</button>':'<button id="finish-btn" class="btn btn-success">✓ Fertig</button>',o=`
      <div class="screen training-screen">
        <div class="screen-header">
          <button id="home-btn" class="home-btn" title="Zurück zu Home">🏠</button>
          <div class="header-content">
            <h1>${e.name} - Tag ${this.session.date}</h1>
            <div class="progress-indicator">
              ${this.currentExerciseIndex+1} / ${e.exercises.length}
            </div>
          </div>
        </div>

        <div class="exercise-card">
          <h2>${t.name}</h2>
          <div class="exercise-meta">
            <span>🎯 Sätze: ${t.targetSets}</span>
            <span>⏱️ Pause: ${t.restSeconds}s</span>
          </div>

          ${this.renderLastPerformanceHint(t.id)}

          <div class="sets-history">
            <h3>Absolvierte Sätze (${n.sets.length}/${t.targetSets})</h3>
            <div class="sets-list">
              ${s}
            </div>
          </div>

          <div class="set-input-form">
            <input 
              type="number" 
              id="weight-input" 
              placeholder="Gewicht (kg)" 
              min="0"
              step="2.5"
            />
            <input 
              type="number" 
              id="reps-input" 
              placeholder="Wiederholungen" 
              min="1"
              max="50"
            />
            <button id="add-set-btn" class="btn btn-primary">
              + SET
            </button>
          </div>

          <div class="feeling-selector">
            <p>Wie war die Übung?</p>
            <div class="feeling-buttons">
              <button 
                class="btn ${n.feeling==="good"?"active":""}" 
                data-feeling="good"
              >
                😊 Gut
              </button>
              <button 
                class="btn ${n.feeling==="hard"?"active":""}" 
                data-feeling="hard"
              >
                💪 Hart
              </button>
              <button 
                class="btn ${n.feeling==="too_hard"?"active":""}" 
                data-feeling="too_hard"
              >
                😰 Zu hart
              </button>
            </div>
          </div>

          <div class="hint">📌 Letztes Gewicht: -</div>
        </div>

        <div class="navigation">
          ${i}
          ${a}
        </div>
      </div>
    `;this.container.innerHTML=o,this.attachEventListeners()}attachEventListeners(){var e,t,n,s,i;(e=document.getElementById("home-btn"))==null||e.addEventListener("click",()=>this.onHomeClick()),(t=document.getElementById("add-set-btn"))==null||t.addEventListener("click",()=>this.onAddSet()),document.querySelectorAll("[data-feeling]").forEach(a=>{a.addEventListener("click",o=>{const l=o.target.getAttribute("data-feeling");this.onSetFeeling(l)})}),(n=document.getElementById("prev-exercise-btn"))==null||n.addEventListener("click",()=>this.onPrevExercise()),(s=document.getElementById("next-exercise-btn"))==null||s.addEventListener("click",()=>this.onNextExercise()),(i=document.getElementById("finish-btn"))==null||i.addEventListener("click",()=>this.onFinish()),document.addEventListener("keypress",a=>{a.key==="Enter"&&this.onAddSet()})}onAddSet(){var n,s,i;const e=parseFloat(((n=document.getElementById("weight-input"))==null?void 0:n.value)||"0"),t=parseInt(((s=document.getElementById("reps-input"))==null?void 0:s.value)||"0");if(e<=0||t<=0){alert("Gültige Werte eingeben!");return}(i=this.onAddSetCallback)==null||i.call(this,this.session.performances[this.currentExerciseIndex].exerciseId,e,t),document.getElementById("weight-input").value="",document.getElementById("reps-input").value="",document.getElementById("weight-input").focus()}onSetFeeling(e){var t;(t=this.onSetFeelingCallback)==null||t.call(this,this.session.performances[this.currentExerciseIndex].exerciseId,e)}onPrevExercise(){this.currentExerciseIndex>0&&(this.currentExerciseIndex--,this.render())}onNextExercise(){const e=b[this.session.planId];this.currentExerciseIndex<e.exercises.length-1&&(this.currentExerciseIndex++,this.render())}onFinish(){var e;(e=this.onFinishCallback)==null||e.call(this)}onHomeClick(){var t,n;this.session.performances.some(s=>s.sets.length>0)?confirm(`Du hast trainiert. Wirklicht zu Home zurück?
Deine Daten werden gespeichert.`)&&((t=this.onHomeCallback)==null||t.call(this)):(n=this.onHomeCallback)==null||n.call(this)}renderLastPerformanceHint(e){const t=this.repository.getLastPerformanceForPlan(e,this.session.planId);return t.maxWeight?`
      <div class="last-performance-hint">
        <div class="hint-label">Letztes Mal:</div>
        <div class="hint-value">${t.maxWeight}kg × ${t.maxReps} reps</div>
        <div class="hint-date">${t.lastDate}</div>
      </div>
    `:`<div class="last-performance-hint">📌 Erstes Mal diese Übung mit Plan ${this.session.planId.toUpperCase()}</div>`}}class V{constructor(e,t){c(this,"container");c(this,"nutrition");c(this,"onToggleMeal1Callback");c(this,"onToggleMeal2Callback");c(this,"onToggleShakeCallback");c(this,"onUpdateNotesCallback");c(this,"onBackCallback");this.container=e,this.nutrition=t}render(){this.container.innerHTML="";const e=y(this.nutrition),t=[this.nutrition.meal1,this.nutrition.meal2,this.nutrition.shake].filter(Boolean).length,n=`
      <div class="screen nutrition-screen">
        <!-- HEADER -->
        <div class="screen-header">
          <h1>🍽️ Ernährung - ${this.nutrition.date}</h1>
          <div class="completion-indicator">
            ${t}/3 erfasst ${e?"✓":""}
          </div>
        </div>

        <!-- MEAL TOGGLES -->
        <div class="meal-toggle-section">
          <button 
            id="meal1-toggle" 
            class="meal-button ${this.nutrition.meal1?"active":""}"
          >
            <div class="meal-icon">🥗</div>
            <div class="meal-label">Mahlzeit 1</div>
            <div class="meal-status">${this.nutrition.meal1?"✓":"○"}</div>
          </button>

          <button 
            id="meal2-toggle" 
            class="meal-button ${this.nutrition.meal2?"active":""}"
          >
            <div class="meal-icon">🍖</div>
            <div class="meal-label">Mahlzeit 2</div>
            <div class="meal-status">${this.nutrition.meal2?"✓":"○"}</div>
          </button>

          <button 
            id="shake-toggle" 
            class="meal-button ${this.nutrition.shake?"active":""}"
          >
            <div class="meal-icon">🥤</div>
            <div class="meal-label">Shake</div>
            <div class="meal-status">${this.nutrition.shake?"✓":"○"}</div>
          </button>
        </div>

        <!-- NOTES -->
        <div class="notes-section">
          <label for="nutrition-notes">Notizen (optional)</label>
          <textarea 
            id="nutrition-notes" 
            placeholder="z.B. Snacks, spezielle Gedanken..."
            rows="3"
          >${this.nutrition.notes}</textarea>
        </div>

        <!-- STATUS -->
        <div class="status-box ${e?"complete":""}">
          ${e?"<strong>✓ Tag vollständig erfasst!</strong>":"<strong>⏳ Noch zu erfassen:</strong>"+(this.nutrition.meal1?"":" Mahlzeit 1,")+(this.nutrition.meal2?"":" Mahlzeit 2,")+(this.nutrition.shake?"":" Shake")}
        </div>

        <!-- NAVIGATION -->
        <div class="navigation">
          <button id="back-btn" class="btn">← Zurück</button>
        </div>
      </div>
    `;this.container.innerHTML=n,this.attachEventListeners()}attachEventListeners(){var e,t,n,s,i;(e=document.getElementById("meal1-toggle"))==null||e.addEventListener("click",()=>this.onToggleMeal1()),(t=document.getElementById("meal2-toggle"))==null||t.addEventListener("click",()=>this.onToggleMeal2()),(n=document.getElementById("shake-toggle"))==null||n.addEventListener("click",()=>this.onToggleShake()),(s=document.getElementById("nutrition-notes"))==null||s.addEventListener("input",a=>{this.onUpdateNotes(a.target.value)}),(i=document.getElementById("back-btn"))==null||i.addEventListener("click",()=>{var a;return(a=this.onBackCallback)==null?void 0:a.call(this)})}onToggleMeal1(){var e;(e=this.onToggleMeal1Callback)==null||e.call(this)}onToggleMeal2(){var e;(e=this.onToggleMeal2Callback)==null||e.call(this)}onToggleShake(){var e;(e=this.onToggleShakeCallback)==null||e.call(this)}onUpdateNotes(e){var t;(t=this.onUpdateNotesCallback)==null||t.call(this,e)}}class Y{constructor(e,t,n,s=[]){c(this,"container");c(this,"exerciseStats");c(this,"nutritionStats");c(this,"sessions");c(this,"onBackCallback");this.container=e,this.exerciseStats=t,this.nutritionStats=n,this.sessions=s}render(){this.container.innerHTML="";const e=`
      <div class="screen stats-screen">
        <!-- HEADER -->
        <div class="screen-header">
          <h1>📊 Fortschritt</h1>
          <p>Letztes Training pro Übung</p>
        </div>

        <!-- WEEKLY VOLUME -->
        <div class="stats-section">
          <h2>📈 Diese Woche</h2>
          <div class="weekly-summary">
            ${this.renderWeeklyVolume()}
          </div>
        </div>

        <!-- TRAINING STATS -->
        <div class="stats-section">
          <h2>💪 Gewicht & Trend</h2>
          <p style="font-size: 0.85rem; color: #666; margin-bottom: 1rem;">
            <strong>Letztes Training</strong> - Klicke Training starten um zu updaten
          </p>
          <div class="exercise-stats">
            ${this.exerciseStats.map(t=>this.renderExerciseStat(t)).join("")}
          </div>
        </div>

        <!-- NUTRITION STATS -->
        <div class="stats-section">
          <h2>🍽️ Diese Woche (${this.nutritionStats.week})</h2>
          <div class="nutrition-stats">
            <div class="stat-item">
              <div class="stat-label">Tage erfasst:</div>
              <div class="stat-value">
                ${this.nutritionStats.completeDays} / ${this.nutritionStats.totalDays}
              </div>
              <div class="stat-bar">
                <div 
                  class="stat-bar-fill" 
                  style="width: ${this.nutritionStats.averageCompletion*100}%"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- NAVIGATION -->
        <div class="navigation">
          <button id="back-btn" class="btn">← Zurück</button>
        </div>
      </div>
    `;this.container.innerHTML=e,this.attachEventListeners()}renderExerciseStat(e){if(!e.lastWeight)return`
        <div class="exercise-stat">
          <div class="exercise-name">${e.exerciseName}</div>
          <div class="exercise-last-weight">Keine Daten</div>
          <div class="exercise-meta">0 sessions</div>
        </div>
      `;const t=e.trend==="up"?"📈":e.trend==="down"?"📉":"→";let n="";if(e.weightDelta!==null){const s=e.weightDelta>0?"+":"";n=`<span style="color: ${e.weightDelta>0?"#10b981":e.weightDelta<0?"#ef4444":"#999"}; font-weight: 600;"> ${s}${e.weightDelta.toFixed(1)}kg</span>`}return`
      <div class="exercise-stat">
        <div class="exercise-name">${e.exerciseName}</div>
        <div class="exercise-last-weight">
          <strong>${e.lastWeight}kg</strong> ${t}${n}
        </div>
        <div class="exercise-meta">
          ${e.lastDate} • ${e.sessionCount} sessions
        </div>
      </div>
    `}renderWeeklyVolume(){const e=new Date,t=e.getDay(),n=e.getDate()-t+(t===0?-6:1),s=new Date(e.setDate(n)),i=`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}-${String(s.getDate()).padStart(2,"0")}`;let a=0,o=0;return this.sessions.forEach(l=>{const d=new Date(l.date),m=new Date(i);d>=m&&d<=e&&(o++,l.performances.forEach(u=>{a+=u.sets.length}))}),`
      <div class="weekly-stats">
        <div class="weekly-stat">
          <div class="stat-emoji">💪</div>
          <div class="stat-data">
            <div class="stat-value">${a}</div>
            <div class="stat-label">Total Sets</div>
          </div>
        </div>
        <div class="weekly-stat">
          <div class="stat-emoji">🏋️</div>
          <div class="stat-data">
            <div class="stat-value">${o}</div>
            <div class="stat-label">Trainings</div>
          </div>
        </div>
      </div>
    `}attachEventListeners(){var e;(e=document.getElementById("back-btn"))==null||e.addEventListener("click",()=>{var t;return(t=this.onBackCallback)==null?void 0:t.call(this)})}}class K{constructor(e,t,n){c(this,"container");c(this,"sessions");c(this,"nutritionData");c(this,"activeTab","training");c(this,"onBackCallback");this.container=e,this.sessions=t.sort((s,i)=>new Date(i.date).getTime()-new Date(s.date).getTime()),this.nutritionData=n.sort((s,i)=>new Date(i.date).getTime()-new Date(s.date).getTime())}render(){this.container.innerHTML="";const e=`
      <div class="screen history-screen">
        <div class="screen-header">
          <h1>📋 Verlauf</h1>
          <p>Training & Ernährung</p>
        </div>

        <!-- TABS -->
        <div class="history-tabs">
          <button id="tab-training" class="tab-btn ${this.activeTab==="training"?"active":""}">
            💪 Training (${this.sessions.length})
          </button>
          <button id="tab-nutrition" class="tab-btn ${this.activeTab==="nutrition"?"active":""}">
            🍽️ Ernährung (${this.nutritionData.length})
          </button>
        </div>

        <!-- CONTENT -->
        <div class="history-content">
          ${this.activeTab==="training"?this.renderTrainingLog():this.renderNutritionLog()}
        </div>

        <!-- NAVIGATION -->
        <div class="navigation">
          <button id="back-btn" class="btn">← Zurück</button>
        </div>
      </div>
    `;this.container.innerHTML=e,this.attachEventListeners()}renderTrainingLog(){return this.sessions.length===0?'<div class="empty-state"><div class="emoji">📭</div><p>Keine Trainings erfasst</p></div>':`
      <div class="history-list">
        ${this.sessions.map(e=>this.renderTrainingItem(e)).join("")}
      </div>
    `}renderTrainingItem(e){const t=b[e.planId],n=e.performances.reduce((a,o)=>a+o.sets.length,0);let s=0;e.performances.forEach(a=>{a.sets.forEach(o=>{o.weight>s&&(s=o.weight)})});const i=e.performances.filter(a=>a.sets.length>0).map(a=>{const o=t.exercises.find(l=>l.id===a.exerciseId);return(o==null?void 0:o.name)||a.exerciseId});return`
      <div class="history-item training-item">
        <div class="item-date">${this.formatDateFull(e.date)}</div>
        <div class="item-header">
          <div class="item-plan">Plan ${e.planId.toUpperCase()} - ${t.name}</div>
          <div class="item-stats">
            <span>💪 ${n} Sets</span>
            <span>⚖️ ${s}kg max</span>
          </div>
        </div>
        <div class="item-exercises">
          ${i.join(" • ")}
        </div>
      </div>
    `}renderNutritionLog(){return this.nutritionData.length===0?'<div class="empty-state"><div class="emoji">📭</div><p>Keine Ernährung erfasst</p></div>':`
      <div class="history-list">
        ${this.nutritionData.map(e=>this.renderNutritionItem(e)).join("")}
      </div>
    `}renderNutritionItem(e){const t=[e.meal1,e.meal2,e.shake].filter(Boolean).length,n=[e.meal1?"🥗 Mahlzeit 1":null,e.meal2?"🥗 Mahlzeit 2":null,e.shake?"🥤 Shake":null].filter(Boolean).join(" • "),s=t===3?"#10b981":t>=2?"#f59e0b":"#ef4444",i=t===3?"✓ Vollständig":t===2?"⚠️ Unvollständig":"❌ Minimal";return`
      <div class="history-item nutrition-item">
        <div class="item-date">${this.formatDateFull(e.date)}</div>
        <div class="item-header">
          <div class="item-meals" style="color: ${s};">${i}</div>
          <div class="item-count">${t}/3</div>
        </div>
        <div class="item-exercises">${n||"Nichts erfasst"}</div>
        ${e.notes?`<div class="item-notes">📝 ${e.notes}</div>`:""}
      </div>
    `}formatDateFull(e){return new Date(e+"T00:00:00").toLocaleDateString("de-DE",{weekday:"short",year:"numeric",month:"2-digit",day:"2-digit"})}attachEventListeners(){var e,t,n;(e=document.getElementById("tab-training"))==null||e.addEventListener("click",()=>{this.activeTab="training",this.render()}),(t=document.getElementById("tab-nutrition"))==null||t.addEventListener("click",()=>{this.activeTab="nutrition",this.render()}),(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>{var s;(s=this.onBackCallback)==null||s.call(this)})}}class Z{constructor(e){c(this,"container");c(this,"currentScreen","home");c(this,"unsubscribe",null);const t=document.getElementById(e);if(!t)throw new Error(`Container #${e} not found`);this.container=t,this.unsubscribe=g.subscribe(()=>this.render()),this.render()}navigate(e){this.currentScreen=e,this.render()}render(){switch(this.currentScreen){case"home":this.renderHomeScreen();break;case"select-plan":this.renderSelectPlanScreen();break;case"training":this.renderTrainingScreen();break;case"nutrition":this.renderNutritionScreen();break;case"stats":this.renderStatsScreen();break;case"history":this.renderHistoryScreen();break}}renderHomeScreen(){var e,t,n,s,i,a,o;this.container.innerHTML=`
      <div class="screen home-screen">
        <div class="screen-header">
          <h1>💪 Fitness Tracker</h1>
          <p>Offline MVP</p>
        </div>

        <div class="home-menu">
          <button id="btn-training" class="menu-button">
            <div class="icon">🏋️</div>
            <div class="label">Training starten</div>
          </button>

          <button id="btn-nutrition" class="menu-button">
            <div class="icon">🍽️</div>
            <div class="label">Ernährung</div>
          </button>

          <button id="btn-stats" class="menu-button">
            <div class="icon">📊</div>
            <div class="label">Fortschritt</div>
          </button>

          <button id="btn-calendar" class="menu-button">
            <div class="icon">📋</div>
            <div class="label">Verlauf</div>
          </button>
        </div>

        <div class="today-status">
          ${this.renderTodayStatus()}
        </div>

        <div class="debug-section" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.8rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
            <button id="btn-test-data" class="btn" style="background: #4CAF50; color: white;">
              ✅ Test-Daten (30d)
            </button>
            <button id="btn-clear-test" class="btn" style="background: #FF9800; color: white;">
              🧹 Test löschen
            </button>
          </div>
          <button id="btn-reset" class="btn btn-danger" style="width: 100%;">
            🗑️ Alle Daten löschen (DEBUG)
          </button>
        </div>
      </div>
    `,(e=document.getElementById("btn-training"))==null||e.addEventListener("click",()=>this.navigate("select-plan")),(t=document.getElementById("btn-nutrition"))==null||t.addEventListener("click",()=>this.navigate("nutrition")),(n=document.getElementById("btn-stats"))==null||n.addEventListener("click",()=>this.navigate("stats")),(s=document.getElementById("btn-calendar"))==null||s.addEventListener("click",()=>this.navigate("history")),(i=document.getElementById("btn-test-data"))==null||i.addEventListener("click",async()=>{const{writeTestDataToStorage:l,printTestDataSummary:d}=await E(async()=>{const{writeTestDataToStorage:m,printTestDataSummary:u}=await import("./generateTestData-D2cAOJrM.js");return{writeTestDataToStorage:m,printTestDataSummary:u}},[]);l(),d(),location.reload()}),(a=document.getElementById("btn-clear-test"))==null||a.addEventListener("click",async()=>{const{clearTestData:l}=await E(async()=>{const{clearTestData:d}=await import("./generateTestData-D2cAOJrM.js");return{clearTestData:d}},[]);l(),location.reload()}),(o=document.getElementById("btn-reset"))==null||o.addEventListener("click",()=>{confirm("Wirklich alle Daten löschen?")&&(g.resetAll(),this.render())})}renderSelectPlanScreen(){const e=new G(this.container);e.onPlanSelectedCallback=t=>{g.startTrainingSession(t),this.navigate("training")},e.onBackCallback=()=>{this.navigate("home")},e.render()}renderTrainingScreen(){if(!g.currentTrainingSession){this.navigate("home");return}const e=new j(this.container,g.currentTrainingSession,v);e.onAddSetCallback=(t,n,s)=>{g.addSet(t,n,s),e.render()},e.onSetFeelingCallback=(t,n)=>{g.setExerciseFeeling(t,n),e.render()},e.onFinishCallback=()=>{this.navigate("home")},e.onHomeCallback=()=>{this.navigate("home")},e.render()}renderNutritionScreen(){if(!g.currentNutrition){this.navigate("home");return}const e=new V(this.container,g.currentNutrition);e.onToggleMeal1Callback=()=>{g.toggleMeal1()},e.onToggleMeal2Callback=()=>{g.toggleMeal2()},e.onToggleShakeCallback=()=>{g.toggleShake()},e.onUpdateNotesCallback=t=>{g.setNutritionNotes(t)},e.onBackCallback=()=>{this.navigate("home")},e.render()}renderStatsScreen(){const e=new Set;Object.values(b).forEach(d=>{d.exercises.forEach(m=>e.add(m.id))});const t=Array.from(e).map(d=>v.getExerciseStats(d)),n=new Date,s=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;z(s);const i=v.getNutritionForWeek(s),a=W(i),o=v.getAllTrainingSessions(),l=new Y(this.container,t,a,o);l.onBackCallback=()=>this.navigate("home"),l.render()}renderHistoryScreen(){const e=v.getAllTrainingSessions(),t=v.getAllNutrition(),n=new K(this.container,e,t);n.onBackCallback=()=>this.navigate("home"),n.render()}renderTodayStatus(){const e=g.currentTrainingSession,t=g.currentNutrition;let n='<div class="status-items">';if(e){const s=e.performances.reduce((i,a)=>i+a.sets.length,0);n+=`<div class="status-item">🏋️ ${s} Sets absolv.</div>`}if(t){const s=[t.meal1,t.meal2,t.shake].filter(Boolean).length;n+=`<div class="status-item">🍽️ ${s}/3 Mahlzeiten</div>`}return n+="</div>",n}destroy(){this.unsubscribe&&this.unsubscribe()}}const q=new Z("app");window.__app=q;console.log("💪 Fitness Tracker MVP initialized");console.log("Access app via window.__app");export{b as P};
