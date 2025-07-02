import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import {
  signInWithPopup,
  SAMLAuthProvider,
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  linkWithCredential,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  updatePassword,
  AuthErrorCodes,
} from "@firebase/auth";

import { auth } from "../Services/Firebase";
import { useNotification } from "./NotificationProvider";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const notification = useNotification();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // When the user is available, set the user and stop loading
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUpWithEmailAndPassword = useCallback(
    (email, password, navigate) => {
      // Return the outer Promise from setPersistence
      return setPersistence(auth, browserLocalPersistence) 
        .then(() => {
          setIsLoading(true);

          // Return the Promise from createUserWithEmailAndPassword
          return createUserWithEmailAndPassword(auth, email, password) 
            .then((result) => {
              console.log("User created");
              setUser(result.user);
              setIsLoading(false);

              if (navigate) {
                navigate("/homepage"); // Perform navigation here, as it's part of the signup flow
              }
              // You can return result.user or a success status if needed by the caller
              return result.user; // Important: Return something on success for the .then() chain
            })
            .catch((error) => {
              setIsLoading(false); // Stop loading on error too
              switch (error.code) {
                case AuthErrorCodes.EMAIL_EXISTS:
                  notification.error(
                    "An account already exists with this email"
                  );
                  break;
                default:
                  notification.error(
                    "There was an error creating your account"
                  );
              }
              // Re-throw the error so the caller's .catch() can still catch it if desired
              throw error; // Important: Re-throw the error for the .catch() chain
            });
        })
        .catch((error) => {
          setIsLoading(false); // Stop loading on error too
          if (error.code) {
            console.log(error.code, error.message);
            // Optionally, handle persistence errors with notifications
            notification.error(`Persistence error: ${error.message}`);
          }
          throw error; // Re-throw any error from setPersistence as well
        });
    },
    [notification]
  );

  /**
   * Create an account using a SAML auth provider. If in development mode, Google auth
   * is used
   *
   * @param {String} providerId the id of the SAML provider to use. Ignored when in development mode
   * @param {NavigateFunction} navigate the result of the useNavigate hook
   */
  const signUpWithSAML = useCallback(
    (providerId, navigate) => {
      let provider;

      if (
        process.env.NODE_ENV === "production" &&
        providerId.includes("saml")
      ) {
        console.log("SAML provider");
        provider = new SAMLAuthProvider(providerId);
      } else {
        provider = new GoogleAuthProvider();
      }

      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          setIsLoading(true);

          signInWithPopup(auth, provider)
            .then((result) => {
              // console.log(getAdditionalUserInfo(result));
              setUser(result.user);
              setIsLoading(false);

              if (navigate) {
                navigate("/");
              }
            })
            .catch(() => {
              notification.error("There was an error creating your account");
            });
        })
        .catch((error) => {
          if (error.code) {
            console.log(error.code, error.message);
          }
        });
    },
    [notification]
  );

  /**
   * Login using an email and password, performing the specified callback on success
   *
   * @param {String} email email to login with
   * @param {String} password password to login with
   * @param {Function} callback function to perform on success
   */
  const login = useCallback(
    async (email, password, callback) => {
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          signInWithEmailAndPassword(auth, email, password)
            .then(callback)
            .catch((error) => {
              notification.error("Incorrect email or password");
            });
        })
        .catch((error) => {
          if (error.code) {
            console.log(error.code, error.message);
          }
        });
    },
    [notification]
  );

  /**
   * Log the currently signed in user out
   *
   * @param {NavigateFunction | undefined} navigate optional, the result of the useNavigate hook
   */
  const logout = useCallback((navigate) => {
    signOut(auth)
      .then(() => {
        setUser(null);

        // Go to loading
        if (navigate) {
          navigate("/login");
        }
      })
      .catch((error) => {
        if (error.code) {
          console.log(error.code, error.message);
        }
      });
  }, []);

  /**
   * Links a users account with their email and password, performing the provided
   * callback function on success
   *
   * @param {String} email email to link
   * @param {String} password password to link
   * @param {NavigateFunction} navigate the result of the useNavigate hook
   * @param {Function} callback function to perform on success
   */
  const linkEmailAndPassword = useCallback(
    (email, password, navigate, callback) => {
      const credential = EmailAuthProvider.credential(email, password);

      const providerId = user.providerData.filter(
        (x) => x.providerId !== "password"
      )[0].providerId;

      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          linkWithCredential(auth.currentUser, credential)
            .then(() => {
              callback();

              navigate("/classes");
            })
            .catch((error) => {
              if (error.code) {
                if (error.code === "auth/requires-recent-login") {
                  signUpWithSAML(providerId);
                } else {
                  console.log(error.code, error.message);
                }
              }
            });
        })
        .catch((error) => {
          if (error.code) {
            console.log(error.code, error.message);
          }
        });
    },
    [user, signUpWithSAML]
  );

  /**
   * Returns an array of the provider IDs for a given user
   *
   * @param {NextOrObserver<User>} user the user to get the providers for
   *
   * @returns {Array<String>} list of provider Ids
   */
  const getLoginMethodsForUser = useCallback((user) => {
    return user.providerData.map((x) => x.providerId);
  }, []);

  /**
   * Sends a password reset email to the account with the provided email
   *
   * @param {String} email email associated with the account
   */
  const resetPassword = useCallback(
    (email, successCallback = () => {}) => {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          successCallback();

          notification.success("Password reset email sent!");
        })
        .catch((e) => {
          switch (e.code) {
            case AuthErrorCodes.USER_DELETED:
              notification.error(
                "There is no account associated with this email"
              );
              break;
            default:
              notification.error("There was an issue handling your request");
          }
        });
    },
    [notification]
  );

  /**
   * Reauthenticates the current user
   *
   * @param {String} password the current user's password
   */
  const reauthenticate = useCallback(
    async (password) => {
      const credential = EmailAuthProvider.credential(user.email, password);

      try {
        await reauthenticateWithCredential(user, credential);

        return true;
      } catch (e) {
        notification.error("Invalid password");
      }

      return false;
    },
    [notification, user]
  );

  const memoizedValue = useMemo(
    () => ({
      user,
      isLoading,
      signUpWithEmailAndPassword,
      signUpWithSAML,
      linkEmailAndPassword,
      resetPassword,
      getLoginMethodsForUser,
      login,
      logout,
      reauthenticate,
      updatePassword,
    }),
    [
      getLoginMethodsForUser,
      isLoading,
      linkEmailAndPassword,
      login,
      logout,
      reauthenticate,
      resetPassword,
      signUpWithEmailAndPassword,
      signUpWithSAML,
      user,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
