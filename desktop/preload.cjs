const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("vyaparSetuDesktop", {
  platform: process.platform,
});
