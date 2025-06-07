import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { UploadDialog } from "../app/components/UploadDialog";
import { ViewDialog } from "../app/components/ViewDialog";
import { FilesTable } from "../app/components/FilesTable";
import { apiService } from "../services/apiService";
import { FileMetadataView } from "../types/FileMetadata";
import { FilterParams } from "../types/FilterParams";
import SnackbarNotification from "../app/components/SnackbarNotification";

export default function HomePage() {
  const [files, setFiles] = useState<FileMetadataView[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewFileBlob, setViewFileBlob] = useState<Blob | null>(null);
  const [viewFileType, setViewFileType] = useState("");
  const [viewFileText, setViewFileText] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchFiles = async () => {
    setLoading(true);
    const params: FilterParams = { page, size };
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

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpload = async () => {
    if (!selectedFile)
      return showSnackbar("Please select a file to upload", "error");
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await apiService.uploadFile(formData);
      showSnackbar("File uploaded successfully", "success");
      setUploadDialogOpen(false);
      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      console.error("Upload error", error);
      showSnackbar("Error uploading file", "error");
    }
  };

  const handleViewClick = async (fileId: number, contentType: string) => {
    try {
      const blob = await apiService.fetchFileContent(fileId);
      setViewFileBlob(blob);
      setViewFileType(contentType);
      if (
        contentType.startsWith("text/") ||
        contentType === "application/json"
      ) {
        const text = await blob.text();
        setViewFileText(text);
      } else {
        setViewFileText("");
      }
      setViewDialogOpen(true);
    } catch (err) {
      console.error("Error fetching file content", err);
      showSnackbar("Failed to load file preview", "error");
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Typography
        variant="h3"
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
        <Button variant="contained" onClick={() => setUploadDialogOpen(true)}>
          Upload File
        </Button>
      </Grid>

      <FilesTable
        files={files}
        totalCount={totalCount}
        page={page}
        size={size}
        loading={loading}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setSize(parseInt(e.target.value, 10));
          setPage(0);
        }}
        onViewClick={handleViewClick}
      />

      <UploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        selectedFile={selectedFile}
        onFileChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        onUpload={handleUpload}
      />

      <ViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        fileType={viewFileType}
        blob={viewFileBlob}
        fileText={viewFileText}
      />

      <SnackbarNotification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity as any}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
}
