import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { apiService } from "../services/apiService";
import { FileMetadataView } from "../types/FileMetadata";
import { FilterParams } from "../types/FilterParams";

export default function HomePage() {
  const [files, setFiles] = useState<FileMetadataView[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Upload dialog and file state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // View dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewFileBlob, setViewFileBlob] = useState<Blob | null>(null);
  const [viewFileType, setViewFileType] = useState<string>("");
  const [viewFileText, setViewFileText] = useState<string>("");

  // Snackbar notification states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchFiles = async () => {
    setLoading(true);
    const params: FilterParams = {
      page,
      size,
    };

    try {
      const response = await apiService.fetchFilteredFilesList(params);
      setFiles(response.data.content);
      setTotalCount(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching files", error);
      showSnackbar("Error fetching files", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [page, size]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenUploadDialog = () => setUploadDialogOpen(true);
  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showSnackbar("Please select a file to upload.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await apiService.uploadFile(formData);
      showSnackbar("File uploaded successfully.", "success");
      handleCloseUploadDialog();
      fetchFiles();
    } catch (error) {
      console.error("Upload error", error);
      showSnackbar("Error uploading file.", "error");
    }
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleViewClick = async (fileId: number, contentType: string) => {
    try {
      const blob = await apiService.fetchFileContent(fileId);
      setViewFileBlob(blob);
      setViewFileType(contentType);

      if (
        contentType === "application/json" ||
        contentType.startsWith("text/")
      ) {
        const text = await blob.text();
        setViewFileText(text);
      } else {
        setViewFileText("");
      }

      setViewDialogOpen(true);
    } catch (err) {
      console.error("Error fetching file content", err);
      showSnackbar("Failed to load file preview.", "error");
    }
  };

  const prettyPrintJson = (jsonString: string) => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch {
      return jsonString;
    }
  };

  const formatSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    const kb = sizeInBytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f9fafb",
        minHeight: "100vh",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1976d2",
          mb: 4,
          textAlign: "center",
        }}
      >
        File Manager
      </Typography>

      <Grid container justifyContent="center" sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenUploadDialog}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: "600",
            fontSize: "1rem",
            boxShadow: "0 3px 6px rgba(25, 118, 210, 0.5)",
            "&:hover": {
              bgcolor: "#115293",
              boxShadow: "0 6px 12px rgba(17, 82, 147, 0.7)",
            },
          }}
        >
          Upload File
        </Button>
      </Grid>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Upload File</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Choose File
            <input
              type="file"
              onChange={handleFileChange}
              accept=".txt,.jpg,.jpeg,.png,.json"
              hidden
            />
          </Button>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}

          {/* Supported file types text */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Supported file types: .txt, .jpg, .png, .json
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>File Preview</DialogTitle>
        <DialogContent>
          {viewFileBlob && viewFileType.startsWith("image/") && (
            <img
              src={URL.createObjectURL(viewFileBlob)}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 8 }}
            />
          )}
          {(viewFileType === "application/json" ||
            viewFileType.startsWith("text/")) && (
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
              {viewFileType === "application/json"
                ? prettyPrintJson(viewFileText)
                : viewFileText}
            </Box>
          )}
          {!viewFileBlob && (
            <Typography>No preview available for this file type.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Files Table */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          mt: 3,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            "& .MuiTableRow-root:hover": {
              backgroundColor: "#e3f2fd",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            },
          }}
        >
          <TableHead sx={{ bgcolor: "#1976d2" }}>
            <TableRow>
              <TableCell
                sx={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
              >
                File Name
              </TableCell>
              <TableCell
                sx={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
              >
                Size
              </TableCell>

              <TableCell
                sx={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
              >
                Date Uploaded
              </TableCell>
              <TableCell
                sx={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow
                key={file.id}
                hover
                onClick={() => handleViewClick(file.id, file.contentType)}
                tabIndex={-1}
              >
                <TableCell>{file.name}</TableCell>
                <TableCell>{formatSize(file.size)}</TableCell>

                <TableCell>{file.uploadedAt.split("T")[0]}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewClick(file.id, file.contentType);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && files.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  No files found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={size}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          sx={{
            bgcolor: "#f5f5f5",
            "& .MuiTablePagination-toolbar": {
              paddingLeft: 2,
              paddingRight: 2,
            },
          }}
        />
      </TableContainer>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
