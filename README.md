# Capre - Call Privacy Chrome Extension

## Overview
Capre is a Chrome extension designed to enhance call privacy by automatically managing call states during sensitive data input. The extension monitors specific input fields and temporarily pauses calls when users enter sensitive information.

## Features
- Automatic call detection
- Real-time input field monitoring
- Automatic call pause/unpause functionality
- Support for Single Page Applications (SPA)
- Configurable pause duration
- Secure handling of sensitive data

## Installation
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the extension directory
4. Configure the extension settings with your credentials and preferences

## Configuration
The extension requires the following configuration:
- API URL
- User credentials
- Sensor ID
- Extension number
- Pause duration
- Field identifiers for monitoring

## Usage
Once installed and configured, the extension will:
1. Monitor specified input fields on web pages
2. Automatically detect active calls
3. Pause calls when sensitive data is being entered
4. Resume calls after the configured pause duration

## Security
- All sensitive data is handled securely
- No card data is stored or transmitted
- Communication with API uses secure protocols

## Development
Built using:
- JavaScript
- Chrome Extension APIs
- MutationObserver for DOM monitoring
- Async/await for API communication

## License
GPL

## Support
Not Available by the moment