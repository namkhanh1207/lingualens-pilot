// Explicit allowlists: never spread learner-authored records into research output.
export function summarizeLearningRecord(kind:string,d:Record<string,any>) {
 if(kind==='vocab_review')return {rating:d.rating,reviewNumber:typeof d.before==='number'?d.before+1:null,at:d.at,scheduler:d.scheduler};
 const listening=(v:Record<string,any>|null)=>v?{correct:v.correct,attempt:v.attempt,at:v.at,transcriptViewed:v.transcriptViewed,audioPlayed:v.audioPlayed}:null;
 return {contentVersion:d.contentVersion,revision:d.revision,started:d.started,updated:d.updated,listening:listening(d.listening),firstListening:listening(d.firstListening),
  speakingSelfReview:d.speakingReview?{checks:d.speakingReview.checks,at:d.speakingReview.at,adapter:'self-review'}:null,
  writingSelfReview:d.writingReview?{checks:d.writingReview.checks,at:d.writingReview.at,revision:d.writingReview.revision,current:d.writingReview.text===d.writing,adapter:'self-review'}:null,
  interpretation:'Practice and learner self-report; not validated proficiency scores'};
}
