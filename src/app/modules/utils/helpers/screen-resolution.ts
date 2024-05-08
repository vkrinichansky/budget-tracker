const mobileResolution = 480;

export function isMobileWidth() {
  const screenWidth = window.devicePixelRatio * screen.width;

  return screenWidth <= mobileResolution;
}
