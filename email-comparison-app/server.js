const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const cors = require("cors");

const app = express();
const port = 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());

app.post("/compare", upload.array("files", 2), (req, res) => {
  if (!req.files || req.files.length !== 2) {
    console.error("Erreur: Deux fichiers sont requis.");
    return res.status(400).json({ error: "Deux fichiers sont requis." });
  }

  try {
    const workbook1 = XLSX.read(req.files[0].buffer, { type: "buffer" });
    const workbook2 = XLSX.read(req.files[1].buffer, { type: "buffer" });

    const getFirstColumnData = (sheet) => {
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      return jsonData.map((row) => row[0]);
    };

    const firstFileEmails = getFirstColumnData(
      workbook1.Sheets[workbook1.SheetNames[0]]
    );
    const secondFileEmails = getFirstColumnData(
      workbook2.Sheets[workbook2.SheetNames[0]]
    );

    // Logs pour débogage :
    console.log("Emails du premier fichier:", firstFileEmails);
    console.log("Emails du deuxième fichier:", secondFileEmails);

    if (!firstFileEmails.length || !secondFileEmails.length) {
      console.error(
        "Erreur: Format de fichier invalide ou aucune donnée trouvée."
      );
      return res.status(400).json({ error: "Format de fichier invalide." });
    }

    const missingEmails = secondFileEmails.filter(
      (email2) => !firstFileEmails.includes(email2)
    );

    console.log("Emails manquants:", missingEmails); // Logs pour débogage
    res.json(missingEmails);
  } catch (error) {
    console.error("Erreur lors de la comparaison:", error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la comparaison des fichiers." });
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
