import { useState, useMemo, useCallback } from "react";

export function useFolderAccess() {
  const [folderPasswords, setFolderPasswords] = useState<
    Record<string, string>
  >({});
  const [passwordDialog, setPasswordDialog] = useState<{
    isOpen: boolean;
    folderId?: string;
    isRetry: boolean;
    onSuccess?: (folderId: string) => void;
  }>({ isOpen: false, isRetry: false });

  // Memoize folderPasswords to prevent unnecessary re-renders
  const memoizedFolderPasswords = useMemo(
    () => folderPasswords,
    [folderPasswords]
  );

  // Memoize passwordDialog to prevent unnecessary re-renders
  const memoizedPasswordDialog = useMemo(
    () => passwordDialog,
    [
      passwordDialog.isOpen,
      passwordDialog.folderId,
      passwordDialog.isRetry,
      passwordDialog.onSuccess,
    ]
  );

  // Check if we have access to a folder
  const checkFolderAccess = useCallback(
    (
      folderId: string,
      accessibility: string,
      onSuccess: (folderId: string) => void
    ) => {
      if (accessibility === "protected" && !folderPasswords[folderId]) {
        // Need password
        setPasswordDialog({
          isOpen: true,
          folderId,
          isRetry: false,
          onSuccess,
        });
        return false;
      }
      return true;
    },
    [folderPasswords]
  );

  // Handle password submission
  const handlePasswordSubmit = useCallback(
    (password: string) => {
      const folderId = passwordDialog.folderId;
      if (!folderId) return;

      // Store the password
      setFolderPasswords((prev) => ({
        ...prev,
        [folderId]: password,
      }));
    },
    [passwordDialog.folderId]
  );

  // Open dialog for wrong password
  const handleWrongPassword = useCallback((folderId: string) => {
    setPasswordDialog({
      isOpen: true,
      folderId,
      isRetry: true,
    });
  }, []);

  // Reset password for a folder
  const resetFolderPassword = useCallback((folderId: string) => {
    setFolderPasswords((prev) => {
      const newPasswords = { ...prev };
      delete newPasswords[folderId];
      return newPasswords;
    });
  }, []);

  // Close password dialog
  const closePasswordDialog = useCallback(() => {
    setPasswordDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    folderPasswords: memoizedFolderPasswords,
    passwordDialog: memoizedPasswordDialog,
    closePasswordDialog,
    checkFolderAccess,
    handlePasswordSubmit,
    handleWrongPassword,
    resetFolderPassword,
  };
}
