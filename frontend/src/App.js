import React, { useState } from "react";
import {
  Button,
  Container,
  CssBaseline,
  Typography,
  List,
  ListItem,
  TextField,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import axios from "axios";

function App() {
  const [firstFile, setFirstFile] = useState(null);
  const [secondFile, setSecondFile] = useState(null);
  const [missingEmails, setMissingEmails] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleFirstFileChange = (e) => {
    setFirstFile(e.target.files[0]);
    setSnackbarMessage("Premier fichier chargé avec succès!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleSecondFileChange = (e) => {
    setSecondFile(e.target.files[0]);
    setSnackbarMessage("Deuxième fichier chargé avec succès!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const compareFiles = async () => {
    const formData = new FormData();
    formData.append("files", firstFile);
    formData.append("files", secondFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/compare",
        formData
      );
      if (response.data && response.data.length) {
        setMissingEmails(response.data);
        setSnackbarMessage("Comparaison terminée!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Aucun e-mail manquant trouvé.");
        setSnackbarSeverity("info");
      }
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Erreur lors de la comparaison des fichiers.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
        <Typography
          component="h1"
          variant="h5"
          style={{ marginBottom: "20px" }}
        >
          Comparaison d'emails
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="firstFile"
          label="Choisissez le premier fichier Excel"
          type="file"
          id="firstFile"
          accept=".xlsx"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleFirstFileChange}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="secondFile"
          label="Choisissez le deuxième fichier Excel"
          type="file"
          id="secondFile"
          accept=".xlsx"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleSecondFileChange}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={compareFiles}
          style={{ marginTop: "10px" }}
        >
          Comparer
        </Button>

        <List>
          {missingEmails.map((email, index) => (
            <ListItem key={index}>{email}</ListItem>
          ))}
        </List>

        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          autoHideDuration={2000}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default App;
