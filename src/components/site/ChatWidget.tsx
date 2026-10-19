"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/**
 * Smartsupp live chat. Loaded only after the visitor accepted the optional
 * cookie categories in the consent gate (a chat widget sets its own cookies,
 * so mounting it before a choice would undo the ePrivacy gate). If consent is
 * granted later via "Manage cookies", the widget starts on the fly.
 */
const STORAGE_KEY = "arm-cookie-consent-v1";
const CONSENT_SAVED_EVENT = "arm:consent-saved";

function chatAllowed(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as {
      version?: number;
      analytics?: boolean;
      marketing?: boolean;
    };
    return parsed.version === 1 && Boolean(parsed.marketing || parsed.analytics);
  } catch {
    return false;
  }
}

const SMARTSUPP_SNIPPET = `var _smartsupp = _smartsupp || {};
_smartsupp.key = '373bc1752bd1d56d942f9e46467ea096af424b24';
window.smartsupp||(function(d) {
  var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
  s=d.getElementsByTagName('script')[0];c=d.createElement('script');
  c.type='text/javascript';c.charset='utf-8';c.async=true;
  c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
})(document);`;

export function ChatWidget() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (chatAllowed()) setEnabled(true);
    const onSaved = () => {
      if (chatAllowed()) setEnabled(true);
    };
    window.addEventListener(CONSENT_SAVED_EVENT, onSaved);
    return () => window.removeEventListener(CONSENT_SAVED_EVENT, onSaved);
  }, []);

  if (!enabled) return null;
  return (
    <Script
      id="smartsupp-chat"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: SMARTSUPP_SNIPPET }}
    />
  );
}
