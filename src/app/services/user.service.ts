import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider, 
  UserCredential 
} from '@angular/fire/auth';
import { getDatabase, ref, get, set, push, query, orderByChild } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth) {}

  // Registrar usuario en bd Authentication
  async register({ email, password }: { email: string, password: string }): Promise<UserCredential> {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error;
    }
  }

  // Iniciar sesión con email y contraseña
  async login({ email, password }: { email: string, password: string }): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Iniciar sesión con Google
  async loginWithGoogle(): Promise<UserCredential> {
    try {
      return await signInWithPopup(this.auth, new GoogleAuthProvider());
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Sesión cerrada con éxito.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Obtener todas las áreas y sus módulos desde la base de datos
  async getAreasYModulos(): Promise<any> {
    const db = getDatabase();
    const areasRef = ref(db, 'areas');
    const snapshot = await get(areasRef);
  
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No se encontraron áreas disponibles.");
    }
  }

  // Obtener los módulos de una área específica
  async getModulosPorArea(area: string): Promise<string[]> {
    const db = getDatabase();
    const areaRef = ref(db, `areas/${area}/modulos`);
    const snapshot = await get(areaRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error(`No se encontraron módulos para el área ${area}.`);
    }
  }

  // Obtener datos de un usuario por su UID
  async getUserData(uid: string): Promise<any> {
    const db = getDatabase();
    const userRef = ref(db, `usuarios/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error('No se encontraron datos del usuario.');
    }
  }

  // Guardar datos adicionales del usuario en la base de datos
  async guardarDatosUsuario(uid: string, datosUsuario: any): Promise<void> {
    const db = getDatabase();
    const userRef = ref(db, `usuarios/${uid}`);

    try {
      await set(userRef, datosUsuario);
      console.log('Datos del usuario guardados con éxito.');
    } catch (error) {
      console.error('Error al guardar los datos del usuario:', error);
      throw error;
    }
  }

  // Registrar un usuario en Authentication y guardar datos adicionales en bd
  async registerUser(email: string, password: string, additionalData: any): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user?.uid;

      if (uid) {
        await this.guardarDatosUsuario(uid, additionalData);
      } else {
        throw new Error('No se pudo obtener el UID del usuario.');
      }
    } catch (error) {
      console.error('Error al registrar el usuario con datos adicionales:', error);
      throw error;
    }
  }

  // Obtener el UID del usuario logueado
  getCurrentUserUid(): string | null {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }

  // Obtener los datos del usuario logueado (incluyendo su rol)
  async getCurrentUserData(): Promise<any> {
    const db = getDatabase();
    const uid = this.getCurrentUserUid();
    if (!uid) throw new Error('No hay usuario autenticado.');

    const userRef = ref(db, `usuarios/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error('No se encontraron datos del usuario.');
    }
  }

  // Guardar una nueva reserva en la base de datos para cada área
  async guardarReservaPrensa(reserva: any) {
    const db = getDatabase();
    const reservasRef = ref(db, 'reservas_prensa');
    const nuevaReservaRef = push(reservasRef);
    
    await set(nuevaReservaRef, {
      ...reserva,
      timestamp: new Date().toISOString()
    });
  }

  async guardarReservaCancha1(reserva: any) {
    const db = getDatabase();
    const reservasRef = ref(db, 'reservas_cancha1');
    const nuevaReservaRef = push(reservasRef);

    await set(nuevaReservaRef, {
      ...reserva,
      timestamp: new Date().toISOString()
    });
  }

  async guardarReservaCancha2(reserva: any) {
    const db = getDatabase();
    const reservasRef = ref(db, 'reservas_cancha2');
    const nuevaReservaRef = push(reservasRef);

    await set(nuevaReservaRef, {
      ...reserva,
      timestamp: new Date().toISOString()
    });
  }

  async guardarReservaCancha3(reserva: any) {
    const db = getDatabase();
    const reservasRef = ref(db, 'reservas_cancha3');
    const nuevaReservaRef = push(reservasRef);

    await set(nuevaReservaRef, {
      ...reserva,
      timestamp: new Date().toISOString()
    });
  }

  async guardarReservaComedor(reserva: any) {
    const db = getDatabase();
    const reservasRef = ref(db, 'reservas_comedor');
    const nuevaReservaRef = push(reservasRef);

    await set(nuevaReservaRef, {
      ...reserva,
      timestamp: new Date().toISOString()
    });
  }

  // Obtener todas las reservas desde la base de datos para cada área
  async obtenerReservasPrensa(): Promise<any[]> {
    const db = getDatabase();
    const reservasRef = query(ref(db, 'reservas_prensa'), orderByChild('fecha'));
    const snapshot = await get(reservasRef);
    
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      return [];
    }
  }

  async obtenerReservasCancha1(): Promise<any[]> {
    const db = getDatabase();
    const reservasRef = query(ref(db, 'reservas_cancha1'), orderByChild('fecha'));
    const snapshot = await get(reservasRef);
    
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      return [];
    }
  }

  async obtenerReservasCancha2(): Promise<any[]> {
    const db = getDatabase();
    const reservasRef = query(ref(db, 'reservas_cancha2'), orderByChild('fecha'));
    const snapshot = await get(reservasRef);
    
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      return [];
    }
  }

  async obtenerReservasCancha3(): Promise<any[]> {
    const db = getDatabase();
    const reservasRef = query(ref(db, 'reservas_cancha3'), orderByChild('fecha'));
    const snapshot = await get(reservasRef);
    
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      return [];
    }
  }

  async obtenerReservasComedor(): Promise<any[]> {
    const db = getDatabase();
    const reservasRef = query(ref(db, 'reservas_comedor'), orderByChild('fecha'));
    const snapshot = await get(reservasRef);
    
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      return [];
    }
  }
}
