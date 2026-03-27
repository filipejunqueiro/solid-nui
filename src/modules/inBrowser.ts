const inBrowser = (): boolean => {
  if (typeof window !== "undefined" && (window as any).invokeNative) return true;

  return false;
};

export default inBrowser;
