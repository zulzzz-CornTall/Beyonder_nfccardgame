import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add basic health check route for debugging
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  let server;
  try {
    server = await registerRoutes(app);
  } catch (error) {
    console.error("Failed to register routes:", error);
    process.exit(1);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  // Use static file serving with the correct build path
  console.log("Setting up static file serving...");
  const distPath = path.resolve(__dirname, "../dist/public");
  console.log("Looking for build files in:", distPath);
  
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
    console.log("Static file serving setup complete");
  } else {
    console.log("Build files not found, serving fallback HTML...");
    app.get('*', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>NFC Fighter</title>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body>
            <div id="root">
              <div style="text-align: center; padding: 50px; font-family: Arial;">
                <h1>🎮 NFC Fighter</h1>
                <p>Application starting up...</p>
                <p><small>Build files not found - please run npm run build</small></p>
              </div>
            </div>
          </body>
        </html>
      `);
    });
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const port = 5000;
  server.listen(port, "0.0.0.0", (err?: Error) => {
    if (err) {
      console.error("Server failed to start:", err);
      process.exit(1);
    }
    log(`serving on port ${port}`);
    console.log(`Server successfully started on http://0.0.0.0:${port}`);
  });
})();
