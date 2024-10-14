# Dataverse Web Resource Editor - Chrome Extension

This Chrome extension provides a quick and efficient way to manage and edit JavaScript web resources in Dynamics 365. The extension allows users to view, edit, and publish web resources directly from their browser without navigating through multiple screens in the Dynamics 365 interface.

## Features

- **List Web Resources**: When a form is opened in Dynamics 365, the extension lists all JavaScript web resources associated with that form.
- **Quick Overview**: See a summary of all JavaScript functions, along with the events they are registered on.
- **Inline Editing**: Directly edit the content of a web resource (JavaScript or HTML) within the extension.
- **Save and Publish**: Save changes to the web resource and publish them instantly without having to open the full Dynamics 365 interface.
- **Solution-Based Management**: Browse and edit web resources across multiple solutions in Dynamics 365.
- **Search Functionality**: Quickly find web resources across different solutions by name or part of the script content.

## How to Install

1. Clone or download the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the upper-right corner.
4. Click **Load unpacked** and select the folder where the extension is located.
5. The extension will now be installed and visible in your Chrome toolbar.

## How to Use

1. Open any Dynamics 365 form in your browser.
2. Click the Dynamics 365 Web Resource Editor icon in your Chrome toolbar.
3. The extension will list all web resources related to the form.
4. Click on any web resource to view a quick summary of the functions and events it’s registered on.
5. Select **Edit** to open the editor and modify the content of the web resource.
6. After making changes, click **Save** and **Publish** to apply the updates directly to Dynamics 365.

## Screenshots

<!-- Add screenshots of the extension in action here -->

## Known Issues

- The extension requires the correct permissions to interact with Dynamics 365 environments. Ensure that your browser session has proper access to the Dynamics 365 instance.
- Large web resources might take a few seconds to load in the editor.

## Future Enhancements

- **Version Control Integration**: Add support for GitHub or other version control systems to track changes to web resources.
- **Support for Other Resource Types**: Extend functionality to handle images, XML, and other resource types.
- **Offline Editing**: Allow users to edit resources offline and sync changes once back online.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request. You can also open issues if you encounter any bugs or have suggestions for new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
