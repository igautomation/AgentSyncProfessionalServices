# System Dependencies

This framework uses packages that require native system dependencies, particularly for chart generation with `canvas` and `chartjs-node-canvas`.

## Required Dependencies

### macOS

Install the required dependencies using Homebrew:

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### Ubuntu/Debian Linux

Install the required dependencies using apt:

```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

### CentOS/RHEL/Fedora

Install the required dependencies using yum:

```bash
sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel
```

### Windows

For Windows, you'll need:

1. Visual Studio Build Tools with C++ support
2. GTK 2 for canvas support

Follow the [node-canvas Windows installation guide](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows) for detailed instructions.

## Verifying Installation

You can verify that all dependencies are correctly installed by running:

```bash
npx @igautomation/agentsyncprofessionalservices check-dependencies
```

## Troubleshooting

### Common Issues

#### Missing pkg-config

Error: `/bin/sh: pkg-config: command not found`

Solution: Install pkg-config using your system's package manager.

#### Chart.js Version Conflicts

Error: `npm warn ERESOLVE overriding peer dependency`

Solution: This framework uses chart.js v4.x with chartjs-node-canvas. The package.json includes overrides to handle this compatibility. You can safely ignore these warnings.

#### Canvas Build Failures

If you encounter build failures with the canvas package, ensure all system dependencies are installed and try reinstalling with:

```bash
npm install --build-from-source
```

For more help, please refer to the [node-canvas documentation](https://github.com/Automattic/node-canvas).