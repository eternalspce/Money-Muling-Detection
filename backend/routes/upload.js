import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

import { buildGraph } from "../services/graphBuilder.js";
import { detectCycles } from "../services/cycleDetector.js";
import { detectSmurfing } from "../services/smurfDetector.js";
import { scoreAccounts } from "../services/scoring.js";
import { formatOutput } from "../services/formatter.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }         // 5MB Limit
});

router.post("/", upload.single("file"), (req, res) => {

  if (!req.file) return res.status(400).json({ error:"No file uploaded" });

  const start = Date.now();
  const transactions = [];
  let responded = false;

  const cleanup = () => {
    try { fs.unlinkSync(req.file.path); } catch {}
  };

  const stream = fs.createReadStream(req.file.path).pipe(csv());

  stream.on("data", row => {
    try {

      if (!row.sender_id || !row.receiver_id || !row.amount || !row.timestamp) {
        throw new Error("Missing required fields: sender_id, receiver_id, amount, timestamp");
      }

      const amount = Number(row.amount);
      if (isNaN(amount) || amount <= 0) throw new Error("Amount must be a positive number");

      transactions.push({
        sender: row.sender_id.trim(),
        receiver: row.receiver_id.trim(),
        amount,
        timestamp: row.timestamp.trim()
      });

    } catch(err){
      if(!responded){
        responded = true;
        cleanup();
        res.status(400).json({error: `CSV parsing error: ${err.message}`});
      }
    }
  });

  stream.on("end", ()=>{

    if(responded) return;
    cleanup();

    if(transactions.length === 0){
      return res.status(400).json({error:"CSV empty"});
    }

    try{

      const graphData = buildGraph(transactions);
      const rings = detectCycles(graphData.adj);
      const smurf = detectSmurfing(transactions);
      const suspicious = scoreAccounts(rings, smurf);

      const output = formatOutput(
        suspicious,
        rings,
        graphData.nodes.length,
        Date.now() - start
      );

      res.json({ graph: graphData, result: output });

    } catch(err){
      console.error(err);
      res.status(500).json({error:"Processing failed"});
    }

  });

  stream.on("error", err=>{
    console.error(err);
    if(!responded){
      responded=true;
      cleanup();
      res.status(500).json({error:"File read error"});
    }
  });

});

export default router;
