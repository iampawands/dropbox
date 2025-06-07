import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import React from "react";

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
}

export const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onClose,
  onUpload,
  onFileChange,
  selectedFile,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ fontWeight: "bold" }}>Upload File</DialogTitle>
    <DialogContent>
      <Button variant="outlined" component="label" sx={{ mt: 2 }}>
        Choose File
        <input
          type="file"
          onChange={onFileChange}
          accept=".txt,.jpg,.jpeg,.png,.json"
          hidden
        />
      </Button>
      {selectedFile && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected file: {selectedFile.name}
        </Typography>
      )}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        Supported file types: .txt, .jpg, .png, .json
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" onClick={onUpload}>
        Upload
      </Button>
    </DialogActions>
  </Dialog>
);
