import React, { useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { auth, db } from '../services/firebase';
import { registerWithEmail, loginWithEmail, logoutUser } from '../services/firebaseAuth';
import { createUserProfile } from '../services/userService';
import { 
  setUser, 
  setLoading as setReduxLoading, 
  clearUser,
  selectCurrentUser,
  selectAuthLoading 
} from '../store/slices/authSlice';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Subscribe to real-time updates from Firestore
        const userRef = doc(db, 'users', user.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            dispatch(setUser({ id: docSnap.id, ...docSnap.data() }));
          } else {
            // Fallback if the user document is not yet created
            dispatch(setUser({
              id: user.uid,
              email: user.email,
              username: user.email.split('@')[0], 
              name: user.displayName || user.email.split('@')[0],
              profileImage: user.photoURL || null,
              coverImage: null
            }));
          }
        }, (error) => {
          console.error("Error listening to real-time profile:", error);
          dispatch(setReduxLoading(false));
        });
      } else {
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
        dispatch(clearUser());
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [dispatch]);

  const register = async (email, password, name) => {
    const userCredential = await registerWithEmail(email, password);
    if (name) {
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(userCredential.user, { displayName: name });
    }
    
    // Step 2: Ensure User Document Creation immediately on signup
    await createUserProfile(userCredential.user, { name });
    
    return userCredential.user;
  };

  const login = async (email, password) => {
    const userCredential = await loginWithEmail(email, password);
    return userCredential.user;
  };

  const logout = async () => {
    await logoutUser();
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
