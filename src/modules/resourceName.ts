const resourceName = (): string => {
  if (typeof window !== "undefined" && (window as any).GetParentResourceName)
    return (window as any).GetParentResourceName() as string;

  return "cfx-resource-name";
};

export default resourceName;
