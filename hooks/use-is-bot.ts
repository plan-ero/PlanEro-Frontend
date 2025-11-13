"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if the current request is from a bot/crawler
 * Checks user agent for common bot patterns
 */
export function useIsBot(): boolean {
  const [isBot, setIsBot] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      setIsBot(false);
      return;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    
    // Common bot/crawler patterns
    const botPatterns = [
      'googlebot',
      'bingbot',
      'slurp', // Yahoo
      'duckduckbot',
      'baiduspider',
      'yandexbot',
      'facebookexternalhit',
      'twitterbot',
      'rogerbot',
      'linkedinbot',
      'embedly',
      'quora link preview',
      'showyoubot',
      'outbrain',
      'pinterest',
      'developers.google.com/+/web/snippet',
      'slackbot',
      'vkshare',
      'w3c_validator',
      'redditbot',
      'applebot',
      'whatsapp',
      'flipboard',
      'tumblr',
      'bitlybot',
      'skypeuripreview',
      'nuzzel',
      'discordbot',
      'qwantify',
      'pinterestbot',
      'bitrix link preview',
      'xing-contenttabreceiver',
      'chrome-lighthouse',
      'telegrambot',
      'semrushbot',
      'ahrefsbot',
      'dotbot',
      'mj12bot',
      'petalbot',
    ];

    const detected = botPatterns.some(pattern => userAgent.includes(pattern));
    setIsBot(detected);
  }, []);

  return isBot;
}
