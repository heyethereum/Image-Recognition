"use strict";
const async = require("async");
const fs = require("fs");
const https = require("https");
const path = require("path");
const createReadStream = require("fs").createReadStream;
const sleep = require("util").promisify(setTimeout);
const ComputerVisionClient =
  require("@azure/cognitiveservices-computervision").ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;
require("dotenv").config();

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
const { AZURE_CV_KEY, AZURE_CV_ENDPOINT } = process.env;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({
    inHeader: { "Ocp-Apim-Subscription-Key": AZURE_CV_KEY },
  }),
  AZURE_CV_ENDPOINT
);
/**
 * END - Authenticate
 */

function computerVision() {
  async.series(
    [
      async function () {
        /**
         * DETECT TAGS
         * Detects tags for an image, which returns:
         *     all objects in image and confidence score.
         */
        console.log("-------------------------------------------------");
        console.log("DETECT TAGS");
        console.log();

        // URL of image to be analyzed
        const tagsURL =
          "https://hips.hearstapps.com/hmg-prod/images/easter-bunny-origins-1581358909.jpg";

        // Analyze URL image
        console.log("Analyzing tags in image...", tagsURL.split("/").pop());
        const tags = (
          await computerVisionClient.analyzeImage(tagsURL, {
            visualFeatures: ["Tags"],
          })
        ).tags;
        console.log(`Tags: ${formatTags(tags)}`);

        // Format tags for display
        function formatTags(tags) {
          return tags
            .map((tag) => `${tag.name} (${tag.confidence.toFixed(2)})`)
            .join(", ");
        }
        /**
         * END - Detect Tags
         */
        console.log();
        console.log("-------------------------------------------------");
        console.log("End of quickstart.");
      },
      function () {
        return new Promise((resolve) => {
          resolve();
        });
      },
    ],
    (err) => {
      throw err;
    }
  );
}

computerVision();
