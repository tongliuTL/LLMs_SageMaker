"use strict";
(self["webpackChunkjupyterlab_code_formatter"] = self["webpackChunkjupyterlab_code_formatter"] || []).push([["lib_index_js"],{

/***/ "./lib/client.js":
/*!***********************!*\
  !*** ./lib/client.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/services */ "webpack/sharing/consume/default/@jupyterlab/services");
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");



class JupyterlabCodeFormatterClient {
    request(path, method, body) {
        const settings = _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeSettings();
        const fullUrl = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.URLExt.join(settings.baseUrl, _constants__WEBPACK_IMPORTED_MODULE_2__.Constants.PLUGIN_NAME, path);
        return _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeRequest(fullUrl, {
            body,
            method
        }, settings).then(response => {
            if (response.status !== 200) {
                return response.text().then(() => {
                    throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.ResponseError(response, response.statusText);
                });
            }
            return response.text();
        });
    }
    getAvailableFormatters(cache) {
        return this.request('formatters' + (cache ? '?cached' : ''), 'GET', null);
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JupyterlabCodeFormatterClient);


/***/ }),

/***/ "./lib/constants.js":
/*!**************************!*\
  !*** ./lib/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Constants": () => (/* binding */ Constants)
/* harmony export */ });
var Constants;
(function (Constants) {
    Constants.PLUGIN_NAME = 'jupyterlab_code_formatter';
    Constants.FORMAT_COMMAND = `${Constants.PLUGIN_NAME}:format`;
    Constants.FORMAT_ALL_COMMAND = `${Constants.PLUGIN_NAME}:format_all`;
    // TODO: Extract this to style and import svg as string
    Constants.ICON_FORMAT_ALL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1792 1792"><path class="jp-icon3" d="M1473 929q7-118-33-226.5t-113-189t-177-131T929 325q-116-7-225.5 32t-192 110.5t-135 175T317 863q-7 118 33 226.5t113 189t177.5 131T862 1467q155 9 293-59t224-195.5t94-283.5zM1792 0l-349 348q120 117 180.5 272t50.5 321q-11 183-102 339t-241 255.5T999 1660L0 1792l347-347q-120-116-180.5-271.5T116 852q11-184 102-340t241.5-255.5T792 132q167-22 500-66t500-66z" fill="#626262"/></svg>';
    Constants.ICON_FORMAT_ALL = 'fa fa-superpowers';
    Constants.SETTINGS_SECTION = `${Constants.PLUGIN_NAME}:settings`;
    Constants.COMMAND_SECTION_NAME = 'Jupyterlab Code Formatter';
    // TODO: Use package.json info
    Constants.PLUGIN_VERSION = '1.6.1';
})(Constants || (Constants = {}));


/***/ }),

/***/ "./lib/formatter.js":
/*!**************************!*\
  !*** ./lib/formatter.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JupyterlabFileEditorCodeFormatter": () => (/* binding */ JupyterlabFileEditorCodeFormatter),
/* harmony export */   "JupyterlabNotebookCodeFormatter": () => (/* binding */ JupyterlabNotebookCodeFormatter)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);

class JupyterlabCodeFormatter {
    constructor(client) {
        this.working = false;
        this.client = client;
    }
    formatCode(code, formatter, options, notebook, cache) {
        return this.client
            .request('format' + (cache ? '?cached' : ''), 'POST', JSON.stringify({
            code,
            notebook,
            formatter,
            options
        }))
            .then(resp => JSON.parse(resp));
    }
}
class JupyterlabNotebookCodeFormatter extends JupyterlabCodeFormatter {
    constructor(client, notebookTracker) {
        super(client);
        this.notebookTracker = notebookTracker;
    }
    async formatAction(config, formatter) {
        return this.formatCells(true, config, formatter);
    }
    async formatSelectedCodeCells(config, formatter, notebook) {
        return this.formatCells(true, config, formatter, notebook);
    }
    async formatAllCodeCells(config, formatter, notebook) {
        return this.formatCells(false, config, formatter, notebook);
    }
    getCodeCells(selectedOnly = true, notebook) {
        if (!this.notebookTracker.currentWidget) {
            return [];
        }
        const codeCells = [];
        notebook = notebook || this.notebookTracker.currentWidget.content;
        notebook.widgets.forEach((cell) => {
            if (cell.model.type === 'code') {
                if (!selectedOnly || notebook.isSelectedOrActive(cell)) {
                    codeCells.push(cell);
                }
            }
        });
        return codeCells;
    }
    getNotebookType() {
        if (!this.notebookTracker.currentWidget) {
            return null;
        }
        const metadata = this.notebookTracker.currentWidget.content.model.metadata.toJSON();
        if (!metadata) {
            return null;
        }
        // prefer kernelspec language
        // @ts-ignore
        if (metadata.kernelspec && metadata.kernelspec.language) {
            // @ts-ignore
            return metadata.kernelspec.language.toLowerCase();
        }
        // otherwise, check language info code mirror mode
        // @ts-ignore
        if (metadata.language_info && metadata.language_info.codemirror_mode) {
            // @ts-ignore
            return metadata.language_info.codemirror_mode.name.toLowerCase();
        }
        return null;
    }
    getDefaultFormatters(config) {
        const notebookType = this.getNotebookType();
        if (notebookType) {
            const defaultFormatter = config.preferences.default_formatter[notebookType];
            if (defaultFormatter instanceof Array) {
                return defaultFormatter;
            }
            else if (defaultFormatter !== undefined) {
                return [defaultFormatter];
            }
        }
        return [];
    }
    async getFormattersToUse(config, formatter) {
        const defaultFormatters = this.getDefaultFormatters(config);
        const formattersToUse = formatter !== undefined ? [formatter] : defaultFormatters;
        if (formattersToUse.length === 0) {
            await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showErrorMessage)('Jupyterlab Code Formatter Error', 'Unable to find default formatters to use, please file an issue on GitHub.');
        }
        return formattersToUse;
    }
    async applyFormatters(selectedCells, formattersToUse, config) {
        var _a;
        for (const formatterToUse of formattersToUse) {
            if (formatterToUse === 'noop' || formatterToUse === 'skip') {
                continue;
            }
            const currentTexts = selectedCells.map(cell => cell.model.value.text);
            const formattedTexts = await this.formatCode(currentTexts, formatterToUse, config[formatterToUse], true, config.cacheFormatters);
            const showErrors = !((_a = config.suppressFormatterErrors) !== null && _a !== void 0 ? _a : false);
            for (let i = 0; i < selectedCells.length; ++i) {
                const cell = selectedCells[i];
                const currentText = currentTexts[i];
                const formattedText = formattedTexts.code[i];
                const cellValueHasNotChanged = cell.model.value.text === currentText;
                if (cellValueHasNotChanged) {
                    if (formattedText.error) {
                        if (showErrors) {
                            await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showErrorMessage)('Jupyterlab Code Formatter Error', formattedText.error);
                        }
                    }
                    else {
                        cell.model.value.text = formattedText.code;
                    }
                }
                else {
                    if (showErrors) {
                        await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showErrorMessage)('Jupyterlab Code Formatter Error', `Cell value changed since format request was sent, formatting for cell ${i} skipped.`);
                    }
                }
            }
        }
    }
    async formatCells(selectedOnly, config, formatter, notebook) {
        if (this.working) {
            return;
        }
        try {
            this.working = true;
            const selectedCells = this.getCodeCells(selectedOnly, notebook);
            if (selectedCells.length === 0) {
                this.working = false;
                return;
            }
            const formattersToUse = await this.getFormattersToUse(config, formatter);
            await this.applyFormatters(selectedCells, formattersToUse, config);
        }
        catch (error) {
            await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showErrorMessage)('Jupyterlab Code Formatter Error', error);
        }
        this.working = false;
    }
    applicable(formatter, currentWidget) {
        const currentNotebookWidget = this.notebookTracker.currentWidget;
        // TODO: Handle showing just the correct formatter for the language later
        return currentNotebookWidget && currentWidget === currentNotebookWidget;
    }
}
class JupyterlabFileEditorCodeFormatter extends JupyterlabCodeFormatter {
    constructor(client, editorTracker) {
        super(client);
        this.editorTracker = editorTracker;
    }
    formatAction(config, formatter) {
        if (this.working) {
            return;
        }
        const editorWidget = this.editorTracker.currentWidget;
        this.working = true;
        const editor = editorWidget.content.editor;
        const code = editor.model.value.text;
        this.formatCode([code], formatter, config[formatter], false, config.cacheFormatters)
            .then(data => {
            if (data.code[0].error) {
                void (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showErrorMessage)('Jupyterlab Code Formatter Error', data.code[0].error);
                this.working = false;
                return;
            }
            this.editorTracker.currentWidget.content.editor.model.value.text =
                data.code[0].code;
            this.working = false;
        })
            .catch(error => {
            this.working = false;
            void (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showErrorMessage)('Jupyterlab Code Formatter Error', error);
        });
    }
    applicable(formatter, currentWidget) {
        const currentEditorWidget = this.editorTracker.currentWidget;
        // TODO: Handle showing just the correct formatter for the language later
        return currentEditorWidget && currentWidget === currentEditorWidget;
    }
}


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/settingregistry */ "webpack/sharing/consume/default/@jupyterlab/settingregistry");
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/mainmenu */ "webpack/sharing/consume/default/@jupyterlab/mainmenu");
/* harmony import */ var _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/fileeditor */ "webpack/sharing/consume/default/@jupyterlab/fileeditor");
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./client */ "./lib/client.js");
/* harmony import */ var _formatter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./formatter */ "./lib/formatter.js");
/* harmony import */ var _lumino_disposable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lumino/disposable */ "webpack/sharing/consume/default/@lumino/disposable");
/* harmony import */ var _lumino_disposable__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_lumino_disposable__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__);










class JupyterLabCodeFormatter {
    constructor(app, tracker, palette, settingRegistry, menu, editorTracker) {
        this.app = app;
        this.tracker = tracker;
        this.editorTracker = editorTracker;
        this.palette = palette;
        this.settingRegistry = settingRegistry;
        this.menu = menu;
        this.client = new _client__WEBPACK_IMPORTED_MODULE_7__["default"]();
        this.notebookCodeFormatter = new _formatter__WEBPACK_IMPORTED_MODULE_8__.JupyterlabNotebookCodeFormatter(this.client, this.tracker);
        this.fileEditorCodeFormatter = new _formatter__WEBPACK_IMPORTED_MODULE_8__.JupyterlabFileEditorCodeFormatter(this.client, this.editorTracker);
        this.setupSettings().then(() => {
            this.setupAllCommands();
            this.setupContextMenu();
            this.setupWidgetExtension();
        });
        console.log('222wat');
    }
    createNew(nb, context) {
        const button = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ToolbarButton({
            tooltip: 'Format notebook',
            icon: new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__.LabIcon({
                name: _constants__WEBPACK_IMPORTED_MODULE_9__.Constants.FORMAT_ALL_COMMAND,
                svgstr: _constants__WEBPACK_IMPORTED_MODULE_9__.Constants.ICON_FORMAT_ALL_SVG
            }),
            onClick: async () => {
                await this.notebookCodeFormatter.formatAllCodeCells(this.config, undefined, nb.content);
            }
        });
        nb.toolbar.insertAfter('cellType', this.app.commands.label(_constants__WEBPACK_IMPORTED_MODULE_9__.Constants.FORMAT_ALL_COMMAND), button);
        context.saveState.connect(this.onSave, this);
        return new _lumino_disposable__WEBPACK_IMPORTED_MODULE_5__.DisposableDelegate(() => {
            button.dispose();
        });
    }
    async onSave(context, state) {
        if (state === 'started' && this.config.formatOnSave) {
            await this.notebookCodeFormatter.formatAllCodeCells(this.config);
        }
    }
    setupWidgetExtension() {
        this.app.docRegistry.addWidgetExtension('Notebook', this);
    }
    setupContextMenu() {
        this.app.contextMenu.addItem({
            command: _constants__WEBPACK_IMPORTED_MODULE_9__.Constants.FORMAT_COMMAND,
            selector: '.jp-Notebook'
        });
    }
    setupAllCommands() {
        this.client
            .getAvailableFormatters(this.config.cacheFormatters)
            .then(data => {
            const formatters = JSON.parse(data).formatters;
            const menuGroup = [];
            Object.keys(formatters).forEach(formatter => {
                if (formatters[formatter].enabled) {
                    const command = `${_constants__WEBPACK_IMPORTED_MODULE_9__.Constants.PLUGIN_NAME}:${formatter}`;
                    this.setupCommand(formatter, formatters[formatter].label, command);
                    menuGroup.push({ command });
                }
            });
            this.menu.editMenu.addGroup(menuGroup);
        });
        this.app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_9__.Constants.FORMAT_COMMAND, {
            execute: async () => {
                await this.notebookCodeFormatter.formatSelectedCodeCells(this.config);
            },
            // TODO: Add back isVisible
            label: 'Format cell'
        });
        this.app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_9__.Constants.FORMAT_ALL_COMMAND, {
            execute: async () => {
                await this.notebookCodeFormatter.formatAllCodeCells(this.config);
            },
            iconClass: _constants__WEBPACK_IMPORTED_MODULE_9__.Constants.ICON_FORMAT_ALL,
            iconLabel: 'Format notebook'
            // TODO: Add back isVisible
        });
    }
    async setupSettings() {
        const settings = await this.settingRegistry.load(_constants__WEBPACK_IMPORTED_MODULE_9__.Constants.SETTINGS_SECTION);
        const onSettingsUpdated = (jsettings) => {
            this.config = jsettings.composite;
        };
        settings.changed.connect(onSettingsUpdated);
        onSettingsUpdated(settings);
    }
    setupCommand(name, label, command) {
        this.app.commands.addCommand(command, {
            execute: async () => {
                for (const formatter of [
                    this.notebookCodeFormatter,
                    this.fileEditorCodeFormatter
                ]) {
                    if (formatter.applicable(name, this.app.shell.currentWidget)) {
                        await formatter.formatAction(this.config, name);
                    }
                }
            },
            isVisible: () => {
                for (const formatter of [
                    this.notebookCodeFormatter,
                    this.fileEditorCodeFormatter
                ]) {
                    if (formatter.applicable(name, this.app.shell.currentWidget)) {
                        return true;
                    }
                }
                return false;
            },
            label
        });
        this.palette.addItem({ command, category: _constants__WEBPACK_IMPORTED_MODULE_9__.Constants.COMMAND_SECTION_NAME });
    }
}
/**
 * Initialization data for the jupyterlab_code_formatter extension.
 */
const plugin = {
    id: _constants__WEBPACK_IMPORTED_MODULE_9__.Constants.PLUGIN_NAME,
    autoStart: true,
    requires: [
        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ICommandPalette,
        _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.INotebookTracker,
        _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2__.ISettingRegistry,
        _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_3__.IMainMenu,
        _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_4__.IEditorTracker
    ],
    activate: (app, palette, tracker, settingRegistry, menu, editorTracker) => {
        new JupyterLabCodeFormatter(app, tracker, palette, settingRegistry, menu, editorTracker);
        console.log('JupyterLab extension jupyterlab_code_formatter is activated!');
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);


/***/ })

}]);
//# sourceMappingURL=lib_index_js.7fcef9ea39c2b4846c2b.js.map