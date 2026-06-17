export type CutStatus = 'pending' | 'cut' | 'kept' | 'ignored';
export type CutReason = 'no_dialogue' | 'long_pause' | 'low_speech_density' | 'gap_between_segments';
export type ProjectStatus = 'idle' | 'analyzing' | 'ready' | 'exporting' | 'error';

export interface SpeechSegment {
  start: number;
  end: number;
  confidence?: number;
}

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  score?: number;
}

export interface TranscriptSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  words: WordTimestamp[];
  speaker?: string;
}

export interface CandidateCut {
  id: string;
  start: number;
  end: number;
  reason: CutReason;
  status: CutStatus;
  duration: number;
}

export interface UserDecision {
  cut_id: string;
  action: CutStatus;
  timestamp?: string;
}

export interface DecisionUpdate {
  cut_id: string;
  status: CutStatus;
}

export interface ProjectSettings {
  min_gap_duration: number;
  margin: number;
  whisper_model: string;
  language?: string;
  initial_prompt?: string;
  device: string;
  export_formats: string[];
  min_speech_confidence: number;
}

export interface Project {
  id: string;
  name: string;
  video_path?: string;
  audio_path?: string;
  status: ProjectStatus;
  error_message?: string;
  settings: ProjectSettings;
  speech_segments: SpeechSegment[];
  transcript_segments: TranscriptSegment[];
  words: WordTimestamp[];
  candidate_cuts: CandidateCut[];
  user_decisions: UserDecision[];
  srt_path?: string;
  vtt_path?: string;
  output_path?: string;
  video_duration?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PipelineEvent {
  step?: string;
  message?: string;
  percent?: number;
  project_id?: string;
  cuts_count?: number;
  files?: Record<string, string>;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  video_duration?: number;
  created_at?: string;
  updated_at?: string;
}
