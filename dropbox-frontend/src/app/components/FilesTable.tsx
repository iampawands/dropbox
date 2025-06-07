import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { FileMetadataView } from "../../types/FileMetadata";
import { formatSize } from "../utils/fileUtils";

interface FilesTableProps {
  files: FileMetadataView[];
  totalCount: number;
  page: number;
  size: number;
  loading: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewClick: (fileId: number, contentType: string) => void;
}

export const FilesTable: React.FC<FilesTableProps> = ({
  files,
  totalCount,
  page,
  size,
  loading,
  onPageChange,
  onRowsPerPageChange,
  onViewClick,
}) => {
  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{ mt: 3, borderRadius: 3, overflow: "hidden" }}
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
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              File Name
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Size
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Date Uploaded
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.id}
              hover
              onClick={() => onViewClick(file.id, file.contentType)}
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
                    onViewClick(file.id, file.contentType);
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!loading && files.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                <Typography>No files found</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={size}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 20]}
        sx={{ bgcolor: "#f5f5f5" }}
      />
    </TableContainer>
  );
};
