import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import './index.css'
import App from './App.tsx'

function Root() {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json())
      .then((config) => {
        Amplify.configure({
          Auth: {
            Cognito: {
              userPoolId: config.USER_POOL_ID,
              userPoolClientId: config.CLIENT_ID,
            }
          }
        });
        setIsConfigured(true);
      })
      .catch((err) => {
        console.error("Failed to load config.json", err);
        setIsConfigured(true);
      });
  }, []);

  if (!isConfigured) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        กำลังโหลดระบบความปลอดภัย...
      </div>
    );
  }

  return <App />;
}

createRoot(getElementByIdOrThrow('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)

function getElementByIdOrThrow(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Root element with ID '${id}' was not found in the document.`);
  }
  return element;
}