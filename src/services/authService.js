import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Create user profile in Firestore
const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date().toISOString();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }

  return userRef;
};

// Email/Password Registration
export const registerWithEmail = async (email, password, displayName) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user profile in Firestore
    await createUserProfile(user, { displayName });
    
    return user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Email/Password Login
export const loginWithEmail = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// GitHub Sign In
export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Password Reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Sign Out
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Auth State Observer
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);
      const userData = snapshot.data();
      callback({ ...user, ...userData });
    } else {
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Error message handler
const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Email address is already registered';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed';
    case 'auth/weak-password':
      return 'Password is too weak';
    case 'auth/user-disabled':
      return 'User account has been disabled';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/popup-closed-by-user':
      return 'Authentication popup was closed';
    default:
      return error.message;
  }
}; 