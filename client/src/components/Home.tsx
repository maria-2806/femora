import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Home = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName); // fallback to email
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  return (
    <div className="p-6 mt-11 text-xl font-medium text-pink-700">
      {userName ? `Hello ${userName}` : 'Loading...'}
    </div>
  );
};

export default Home;
