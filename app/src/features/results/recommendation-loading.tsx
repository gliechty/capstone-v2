"use client";
import { useEffect, useState } from "react";
const words=["Preparing tailored recommendations", "Waiting for generated advice", "Keeping your scores available"];
export function RecommendationLoading(){
 const [index,setIndex]=useState(0);
 useEffect(()=>{const media=window.matchMedia("(prefers-reduced-motion: reduce)");let timer:ReturnType<typeof setInterval>|undefined;
 const update=()=>{if(timer)clearInterval(timer);if(!media.matches)timer=setInterval(()=>setIndex(i=>(i+1)%words.length),2000);};update();media.addEventListener("change",update);return()=>{if(timer)clearInterval(timer);media.removeEventListener("change",update);};},[]);
 return <div className="recommendation-loading mt-4" role="status"><span className="generation-spinner" aria-hidden="true"/><span className="sr-only">Generating recommendations. Scores remain available.</span><span className="loading-words" aria-hidden="true">{words[index]}…</span><span className="loading-reduced" aria-hidden="true">Generating recommendations…</span></div>;
}
