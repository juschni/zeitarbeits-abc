const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({ testDir:'./tests',timeout:20000,webServer:{command:'python3 -m http.server 8765',url:'http://127.0.0.1:8765',reuseExistingServer:false},use:{baseURL:'http://127.0.0.1:8765'},projects:[{name:'chromium',use:{...devices['Desktop Chrome']}},{name:'mobile-chrome',use:{...devices['Pixel 7']}}] });
