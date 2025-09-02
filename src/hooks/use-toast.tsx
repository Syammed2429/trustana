import * as React from "react";

interface Toast {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextType {
  toast: (toast: Toast) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = React.useCallback((toast: Toast) => {
    // Simple console implementation for demo purposes
    // In real implementation, this would show actual toast notifications
    console.log(`Toast: ${toast.title}`, toast.description);

    // You could integrate with a toast library like sonner or react-hot-toast here
    if (typeof window !== "undefined") {
      // Simple alert for demonstration
      alert(
        `${toast.title}${toast.description ? `\n${toast.description}` : ""}`
      );
    }
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
