import { auth } from '../firebase';

export function asyncSignIn(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function asyncSignUp(email: string, password: string) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function asyncSignOut() {
  return auth().signOut();
}
