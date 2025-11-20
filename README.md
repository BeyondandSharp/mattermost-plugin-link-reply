# Mattermost Link Reply Plugin

A Mattermost plugin that adds a "Link Reply" button to the post dropdown menu. When clicked, it inserts a message link and @mention into the text box without auto-sending, allowing users to edit the message before sending.

## Features

- Adds a "Link Reply" button to the post dropdown menu (the "..." menu on each post)
- Inserts `@username [message link]` into the message text box
- Appends to existing draft if present
- Does not auto-send - waits for user to edit and send manually
- Works similar to the todo plugin's button placement

## Requirements

- Mattermost Server v6.2.1 or higher
- Node.js v16 and npm v8 for development

## Installation

1. Download the latest release from the releases page or build from source
2. Upload `com.mattermost.plugin-link-reply.tar.gz` to your Mattermost server via **System Console > Plugins > Plugin Management**
3. Enable the plugin

## Usage

1. Hover over any message and click the "..." menu
2. Select "Link Reply" from the dropdown
3. The message box will be populated with `@username [link to message] `
4. Edit the message as needed and send

## Building from Source

### Prerequisites

- Node.js v16 and npm v8

### Build Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mattermost-plugin-link-reply
cd mattermost-plugin-link-reply
```

2. Install dependencies and build:
```bash
cd webapp
npm install
npm run build
```

3. Package the plugin:
```bash
cd ..
tar -czf com.mattermost.plugin-link-reply.tar.gz plugin.json webapp/dist/main.js
```

This will produce `com.mattermost.plugin-link-reply.tar.gz` ready for upload to your Mattermost server.

## Development

This is a webapp-only plugin with no server component.

### Project Structure

```
mattermost-plugin-link-reply/
├── plugin.json              # Plugin manifest
├── webapp/
│   ├── src/
│   │   ├── index.tsx       # Main plugin entry point
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   ├── webpack.config.js
│   └── dist/               # Built files
└── README.md
```

### Making Changes

1. Edit `webapp/src/index.tsx` to modify plugin behavior
2. Run `npm run build` in the `webapp` directory to build
3. Run `npm run debug:watch` for development with auto-rebuild
4. Package the plugin using `tar -czf com.mattermost.plugin-link-reply.tar.gz plugin.json webapp/dist/main.js`

### Key Implementation Details

- Uses `registerPostDropdownMenuAction` to add the button to post menus
- Accesses Redux store to get post, user, and team information
- Builds permalink using team name and post ID
- Inserts text into the message box via DOM manipulation
- Appends to existing draft content if present

## Technical Details

### Plugin Registry API Used

- `registerPostDropdownMenuAction` - Adds menu item to post dropdown
- Redux store access - Gets post, user, team, and channel information
- DOM manipulation - Updates message text box value

### Format

The inserted text follows this format:
```
@username [full_url_to_message]

```

Example:
```
@john.doe https://mattermost.example.com/myteam/pl/abc123xyz

```

## License

This plugin is based on the [Mattermost Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-starter-template).

## Contributing

Pull requests are welcome! Please ensure your code follows the existing style and includes appropriate tests.
