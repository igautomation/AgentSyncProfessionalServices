# System Dependencies for AgentSync Professional Services

This document outlines the system dependencies required to install and use the AgentSync Professional Services package.

## Canvas Dependency

The package uses the `canvas` library which requires native compilation. If you encounter errors during installation related to `canvas`, you'll need to install the following system dependencies:

### macOS

Using Homebrew:

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

### Windows

For Windows, you'll need to install the following:

1. Install [Microsoft Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Install [GTK 2](https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases)
3. Install [libjpeg-turbo](https://sourceforge.net/projects/libjpeg-turbo/files/)

## Alternative: Optional Canvas

If you're unable to install the system dependencies, you can use the `--no-optional` flag when installing the package:

```bash
npm install github:igautomation/AgentSyncProfessionalServices --no-optional
```

This will skip the installation of the `canvas` dependency, but some features like accessibility testing and chart generation may not work.

## Node.js Version

This package is tested with Node.js versions 16.x, 18.x, and 20.x. Using Node.js 24.x may cause compatibility issues with some dependencies.