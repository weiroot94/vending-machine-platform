const compareVersions = require('compare-versions');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Changelog = require("../models/changelog");
const config = require("../../config");
const logger = require("../logger");

class ChangelogController {
    static ChangelogList = async (req, res, next) => {
        try {
            const result = await Changelog.findOne({ name: req.body.name });
            if (!result) {
                return res.status(404).json({
                    error: "No such changelog data"
                })
            }

            res.status(200).json({
                data: result.changelog
            });

        } catch (err) {
            console.error("Failed to get changelog data:", err);
            res.status(500).json({
                error: "Failed to get changelog data"
            })
        }
    };

    static AddChangelogItem = async (req, res) => {
        try {
            const { name, version, comment, gitbranch, gitcommit, created_at } = req.body;

            let changelog = await Changelog.findOne({ name });

            // If changelog doesn't exist, create a new one
            if (!changelog) {
                changelog = new Changelog({ name, changelog: [] });
            }

            // Check if the version already exists
            const existingVersion = changelog.changelog.find(item => item.version === version);
            if (existingVersion) {
                return res.status(400).json({
                    error: "Version already exists"
                });
            }

            // Check if the new version is higher than the previous one
            const latestVersion = changelog.changelog[changelog.changelog.length - 1]?.version;
            if (latestVersion && compareVersions.compare(version, latestVersion, "<=")) {
                return res.status(400).json({
                    error: "New version should be higher than the previous one"
                });
            }

            // Download latest code zip file from git repository
            const response = await axios.get(`https://api.github.com/repos/elyesa/vendingapp/zipball/${gitbranch}`,
                {
                    responseType: 'arraybuffer',
                    headers: {
                    Authorization: `token ${config.gittoken}`
                    }
                }
            );
            
            if (response.status !== 200) {
                throw new Error(`Failed to download repository: ${response.statusText}`);
            }

            const savePath = path.join("server/upload/vendingapp", "latestapp.zip");
            fs.writeFileSync(savePath, response.data);

            logger.info(`Vending app repository downloaded to ${savePath}`);

            // Add the new changelog item
            changelog.changelog.push({ version, comment, gitbranch, gitcommit, created_at });

            await changelog.save();

            res.status(201).json({
                message: "Changelog item added successfully",
                data: changelog
            });
        } catch (err) {
            console.error("Failed to add changelog item:", err);
            res.status(500).json({
                error: "Failed to add changelog item"
            });
        }
    };

    static GetCurrentVersion = async (name) => {
        try {
            const result = await Changelog.findOne({ name });

            if (result) {
                const latestChangelogItem = result.changelog[result.changelog.length - 1];
                return {
                    version: latestChangelogItem.version,
                    comment: latestChangelogItem.comment
                };
            } else {
                return {};
            }
        } catch (err) {
            console.error("Failed to get current version:", err);
            return {};
        }
    };
}

module.exports = ChangelogController;
