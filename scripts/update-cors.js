#!/usr/bin/env node

// Script to update Firebase Storage CORS configuration
// Run this with: node scripts/update-cors.js

const { exec } = require('child_process');
const path = require('path');

console.log('=== Firebase Storage CORS Configuration Update ===\n');

// Check if Firebase CLI is installed
exec('firebase --version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Firebase CLI not found. Please install it first:');
    console.log('   npm install -g firebase-tools\n');
    console.log('Then log in with:');
    console.log('   firebase login\n');
    return;
  }

  console.log('✅ Firebase CLI version:', stdout.trim());
  
  // Get the project directory
  const projectDir = path.join(__dirname, '..');
  const corsFilePath = path.join(projectDir, 'cors.json');
  
  console.log('\n📝 CORS configuration file:', corsFilePath);
  
  // Deploy CORS configuration
  console.log('\n🚀 Deploying CORS configuration...\n');
  
  // Try the newer Firebase CLI command first
  const deployCommand = `firebase storage:set-cors cors.json`;
  
  exec(deployCommand, { cwd: projectDir }, (deployError, deployStdout, deployStderr) => {
    if (deployError) {
      console.error('❌ Failed to deploy CORS with firebase storage:set-cors:');
      console.error(deployError.message);
      
      // Try alternative command
      console.log('\n🔄 Trying alternative Firebase command...\n');
      
      const altDeployCommand = `firebase storage:bucket:wilsther-professional-services.appspot.com:set-cors cors.json`;
      
      exec(altDeployCommand, { cwd: projectDir }, (altError, altStdout, altStderr) => {
        if (altError) {
          console.error('❌ Failed with alternative Firebase command:');
          console.error(altError.message);
          
          // Try gsutil as final fallback
          console.log('\n🔄 Trying final fallback method with gsutil...\n');
          
          const gsutilCommand = `gsutil cors set cors.json gs://wilsther-professional-services.appspot.com`;
          
          exec(gsutilCommand, { cwd: projectDir }, (gsutilError, gsutilStdout, gsutilStderr) => {
            if (gsutilError) {
              console.error('❌ Failed to update CORS with gsutil:');
              console.error(gsutilError.message);
              console.log('\n💡 To manually update CORS configuration:');
              console.log('   1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install');
              console.log('   2. Run: gcloud auth login');
              console.log('   3. Run: gsutil cors set cors.json gs://wilsther-professional-services.appspot.com');
              console.log('\n📝 Also check the DEPLOY_CORS.md file for detailed instructions.');
            } else {
              console.log('✅ CORS configuration updated successfully with gsutil!');
              console.log(gsutilStdout);
            }
          });
        } else {
          console.log('✅ CORS configuration deployed successfully with alternative Firebase command!');
          console.log(altStdout);
        }
      });
    } else {
      console.log('✅ CORS configuration deployed successfully!');
      console.log(deployStdout);
    }
  });
});