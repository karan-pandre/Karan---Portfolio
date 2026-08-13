import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ThreatItem, IncidentItem, VulnerabilityItem } from '../types/cybersecurity';

export interface CliHistoryItem {
  id: string;
  command: string;
  timestamp: string;
  status: 'Success' | 'Running' | 'Failed';
  category?: string;
  executionTimeMs?: number;
}

export interface SocSessionData {
  updatedAt: string;
  securityScore: number;
  threats: ThreatItem[];
  incidents: IncidentItem[];
  vulnerabilities: VulnerabilityItem[];
  analystName: string;
  commandHistory?: CliHistoryItem[];
}

const SESSION_DOC_PATH = 'soc_sessions';
const SESSION_DOC_ID = 'active_session';
const HISTORY_COLLECTION = 'soc_cmd_history';

export async function saveCommandHistoryToFirestore(history: CliHistoryItem[]): Promise<boolean> {
  try {
    const docRef = doc(db, SESSION_DOC_PATH, SESSION_DOC_ID);
    await setDoc(docRef, {
      commandHistory: history,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    localStorage.setItem('karan_soc_cmd_history_backup', JSON.stringify(history));
    return true;
  } catch (error) {
    console.warn('Firestore command history save failed, fallback to localStorage:', error);
    try {
      localStorage.setItem('karan_soc_cmd_history_backup', JSON.stringify(history));
      return true;
    } catch (e) {
      return false;
    }
  }
}

export async function loadCommandHistoryFromFirestore(): Promise<CliHistoryItem[]> {
  try {
    const docRef = doc(db, SESSION_DOC_PATH, SESSION_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().commandHistory) {
      return docSnap.data().commandHistory as CliHistoryItem[];
    }
  } catch (error) {
    console.warn('Firestore command history load failed, checking localStorage fallback:', error);
  }

  try {
    const local = localStorage.getItem('karan_soc_cmd_history_backup');
    if (local) {
      return JSON.parse(local) as CliHistoryItem[];
    }
  } catch (e) {}

  return [];
}

export async function saveSocSessionToFirestore(data: SocSessionData): Promise<boolean> {
  try {
    const docRef = doc(db, SESSION_DOC_PATH, SESSION_DOC_ID);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    // Also save backup to LocalStorage
    localStorage.setItem('karan_soc_session_backup', JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn('Firestore write failed, fallback to localStorage:', error);
    try {
      localStorage.setItem('karan_soc_session_backup', JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }
}

export async function loadSocSessionFromFirestore(): Promise<SocSessionData | null> {
  try {
    const docRef = doc(db, SESSION_DOC_PATH, SESSION_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SocSessionData;
    }
  } catch (error) {
    console.warn('Firestore read failed, checking localStorage fallback:', error);
  }

  // LocalStorage Fallback
  try {
    const local = localStorage.getItem('karan_soc_session_backup');
    if (local) {
      return JSON.parse(local) as SocSessionData;
    }
  } catch (e) {}

  return null;
}
