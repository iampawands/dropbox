import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import React from "react";
import { prettyPrintJson } from "../utils/fileUtils";

interface ViewDialogProps {
  open: boolean;
  onClose: () => void;
  blob: Blob | null;
  fileType: string;
  fileText: string;
}

export const ViewDialog: React.FC<ViewDialogProps> = ({
  open,
  onClose,
  blob,
  fileType,
  fileText,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle sx={{ fontWeight: "bold" }}>File Preview</DialogTitle>
    <DialogContent>
      {blob && fileType.startsWith("image/") && (
        <img
          src={URL.createObjectURL(blob)}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 8 }}
        />
      )}
      {(fileType === "application/json" || fileType.startsWith("text/")) && (
        <Box
          component="pre"
          sx={{
            whiteSpace: "pre-wrap",
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            p: 2,
            maxHeight: "70vh",
            overflowY: "auto",
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
          }}
        >
          {fileType === "application/json"
            ? prettyPrintJson(fileText)
            : fileText}
        </Box>
      )}
      {!blob && (
        <Typography>No preview available for this file type.</Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);
