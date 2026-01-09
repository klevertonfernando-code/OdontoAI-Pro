export enum ViewType {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ANAMNESIS = 'ANAMNESIS',
  VISION_DIAGNOSTIC = 'VISION_DIAGNOSTIC',
  LAB_ANALYZER = 'LAB_ANALYZER',
  PATIENT_RECORDS = 'PATIENT_RECORDS',
  VOICE_STUDY = 'VOICE_STUDY',
  SIMULATOR = 'SIMULATOR',
  SALES_ENGINE = 'SALES_ENGINE',
  AGENDA = 'AGENDA',
  SETTINGS = 'SETTINGS'
}

export type UserRole = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  pin: string; 
  avatar?: string;
}

export interface ClinicProfile {
  clinicName: string;
  mainDoctorName: string;
  cro: string;
  address: string;
  phone: string;
  logo?: string; 
  primaryColor: string;
}

export interface AuditMetadata {
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  signatureHash: string;
}

export interface Visit {
  id: string;
  date: string;
  procedure: string;
  notes: string;
}

export interface ExamRequest {
  id: string;
  type: string;
  status: 'requested' | 'completed';
  dateRequested: string;
}

export interface PatientImage {
  id: string;
  date: string;
  imageUrl: string;
  analysis: string;
}

export interface LabAnalysis {
  id: string;
  date: string;
  summary: string;
  rawValues: LabData;
}

export type ToothStatus = 'healthy' | 'caries' | 'restoration' | 'missing' | 'endo' | 'implant' | 'crown';

export interface ToothFaces {
  occlusal: ToothStatus;
  vestibular: ToothStatus;
  lingual: ToothStatus;
  mesial: ToothStatus;
  distal: ToothStatus;
}

export interface Tooth {
  id: number;
  faces: ToothFaces;
  generalStatus: ToothStatus;
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  cns?: string;
  occupation?: string;
  history: string;
  complaint: string;
  diagnosis?: string;
  notes: string;
  lastVisit: string;
  visits: Visit[];
  examRequests: ExamRequest[];
  images: PatientImage[];
  labAnalyses: LabAnalysis[];
  odontogram?: Tooth[];
  susInfo?: any;
  audit?: AuditMetadata;
}

export interface LabData {
  erythrocytes: string;
  hemoglobin: string;
  hematocrit: string;
  leukocytes: string;
  platelets: string;
  glucose: string;
  hba1c: string;
  urea: string;
  creatinine: string;
  tap_inr: string;
  ttpa: string;
  calcium: string;
  vitamin_d: string;
  [key: string]: string;
}

export interface AnamnesisForm {
  personal: {
    name: string;
    age: string;
    cns: string;
    occupation: string;
  };
  susInfo: {
    hypertension: boolean;
    diabetes: boolean;
    heartDisease: boolean;
    allergies: string;
    medications: string;
    bleedingHistory: boolean;
    hospitalizations: string;
    smoker: boolean;
    pregnant: boolean;
    otherDiseases: string;
  };
  complaint: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface SimulationPersona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  time: string;
  date: string;
  procedure: string;
  status: 'scheduled' | 'confirmed' | 'waiting' | 'in_service' | 'completed' | 'canceled';
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}