export function preloadImage(source: string) {
  const preloadLink = document.createElement('link');
  preloadLink.href = source;
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  document.head.appendChild(preloadLink);
}

export function preloadImages(sources: string[]) {
  sources.forEach((source) => preloadImage(source));
}
