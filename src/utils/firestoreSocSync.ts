import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ThreatItem, IncidentItem, VulnerabilityItem } from '../types/cybersecurity';

export interface SocSessionData {
  updatedAt: string;
  securityScore: number;
  threats: ThreatItem[];
  incidents: IncidentItem[];
  vulnerabilities: VulnerabilityItem[];
  analystName: string;
}

const SESSION_DOC_PATH = 'soc_sessions';
const SESSION_DOC_ID = 'active_session';

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
