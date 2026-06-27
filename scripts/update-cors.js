#!/usr/bin/env node

// Script to update Firebase Storage CORS configuration
// Run this with: node scripts/update-cors.js

const { exec } = require('child_process');
const path = require('path');

exec('firebase --version', (error, stdout, stderr) => {
  if (error) {
    return;
  }

  const projectDir = path.join(__dirname, '..');
  const corsFilePath = path.join(projectDir, 'cors.json');
  
  const deployCommand = `firebase storage:set-cors cors.json`;
  
  exec(deployCommand, { cwd: projectDir }, (deployError, deployStdout, deployStderr) => {
    if (deployError) {
      const altDeployCommand = `firebase storage:bucket:wilsther-profesional-services.firebasestorage.app:set-cors cors.json`;
      
      exec(altDeployCommand, { cwd: projectDir }, (altError, altStdout, altStderr) => {
        if (altError) {
          const gsutilCommand = `gsutil cors set cors.json gs://wilsther-profesional-services.firebasestorage.app`;
          
          exec(gsutilCommand, { cwd: projectDir }, (gsutilError, gsutilStdout, gsutilStderr) => {
            if (gsutilError) {
            } else {
            }
          });
        } else {
        }
      });
    } else {
    }
  });
});