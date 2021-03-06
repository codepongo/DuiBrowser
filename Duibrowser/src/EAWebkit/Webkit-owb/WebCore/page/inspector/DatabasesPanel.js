/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.DatabasesPanel = function(database)
{
    WebInspector.Panel.call(this);

    this.sidebarElement = document.createElement("div");
    this.sidebarElement.id = "databases-sidebar";
    this.sidebarElement.className = "sidebar";
    this.element.appendChild(this.sidebarElement);

    this.sidebarResizeElement = document.createElement("div");
    this.sidebarResizeElement.className = "sidebar-resizer-vertical";
    this.sidebarResizeElement.addEventListener("mousedown", this._startSidebarDragging.bind(this), false);
    this.element.appendChild(this.sidebarResizeElement);

    this.sidebarTreeElement = document.createElement("ol");
    this.sidebarTreeElement.className = "sidebar-tree";
    this.sidebarElement.appendChild(this.sidebarTreeElement);

    this.sidebarTree = new TreeOutline(this.sidebarTreeElement);

    this.databaseViews = document.createElement("div");
    this.databaseViews.id = "database-views";
    this.element.appendChild(this.databaseViews);

    this.reset();
}

WebInspector.DatabasesPanel.prototype = {
    toolbarItemClass: "databases",

    get toolbarItemLabel()
    {
        return WebInspector.UIString("Databases");
    },

    show: function()
    {
        WebInspector.Panel.prototype.show.call(this);
        this._updateSidebarWidth();
    },

    reset: function()
    {
        if (this._databases) {
            var databasesLength = this._databases.length;
            for (var i = 0; i < databasesLength; ++i) {
                var database = this._databases[i];

                delete database._tableViews;
                delete database._queryView;
            }
        }

        this._databases = [];

        this.sidebarTree.removeChildren();
        this.databaseViews.removeChildren();
    },

    handleKeyEvent: function(event)
    {
        this.sidebarTree.handleKeyEvent(event);
    },

    addDatabase: function(database)
    {
        this._databases.push(database);

        var databaseTreeElement = new WebInspector.DatabaseSidebarTreeElement(database);
        database._databasesTreeElement = databaseTreeElement;

        this.sidebarTree.appendChild(databaseTreeElement);
    },

    showDatabase: function(database, tableName)
    {
        if (!database)
            return;

        if (this.visibleDatabaseView)
            this.visibleDatabaseView.hide();

        var view;
        if (tableName) {
            if (!("_tableViews" in database))
                database._tableViews = {};
            view = database._tableViews[tableName];
            if (!view) {
                view = new WebInspector.DatabaseTableView(database, tableName);
                database._tableViews[tableName] = view;
            }
        } else {
            view = database._queryView;
            if (!view) {
                view = new WebInspector.DatabaseQueryView(database);
                database._queryView = view;
            }
        }

        view.show(this.databaseViews);

        this.visibleDatabaseView = view;
    },

    closeVisibleView: function()
    {
        if (this.visibleDatabaseView)
            this.visibleDatabaseView.hide();
        delete this.visibleDatabaseView;
    },

    updateDatabaseTables: function(database)
    {
        if (!database || !database._databasesTreeElement)
            return;

        database._databasesTreeElement.shouldRefreshChildren = true;

        if (!("_tableViews" in database))
            return;

        var tableNamesHash = {};
        var tableNames = database.tableNames;
        var tableNamesLength = tableNames.length;
        for (var i = 0; i < tableNamesLength; ++i)
            tableNamesHash[tableNames[i]] = true;

        for (var tableName in database._tableViews) {
            if (!(tableName in tableNamesHash)) {
                if (this.visibleDatabaseView === database._tableViews[tableName])
                    this.closeVisibleView();
                delete database._tableViews[tableName];
            }
        }
    },

    dataGridForResult: function(result)
    {
        if (!result.rows.length)
            return null;

        var columns = {};

        var rows = result.rows;
        for (var columnIdentifier in rows.item(0)) {
            var column = {};
            column.width = columnIdentifier.length;
            column.title = columnIdentifier;

            columns[columnIdentifier] = column;
        }

        var nodes = [];
        var length = rows.length;
        for (var i = 0; i < length; ++i) {
            var data = {};

            var row = rows.item(i);
            for (var columnIdentifier in row) {
                // FIXME: (Bug 19439) We should specially format SQL NULL here
                // (which is represented by JavaScript null here, and turned
                // into the string "null" by the String() function).
                var text = String(row[columnIdentifier]);
                data[columnIdentifier] = text;
                if (text.length > columns[columnIdentifier].width)
                    columns[columnIdentifier].width = text.length;
            }

            var node = new WebInspector.DataGridNode(data, false);
            node.selectable = false;
            nodes.push(node);
        }

        var totalColumnWidths = 0;
        for (var columnIdentifier in columns)
            totalColumnWidths += columns[columnIdentifier].width;

        // Calculate the percentage width for the columns.
        const minimumPrecent = 5;
        var recoupPercent = 0;
        for (var columnIdentifier in columns) {
            var width = columns[columnIdentifier].width;
            width = Math.round((width / totalColumnWidths) * 100);
            if (width < minimumPrecent) {
                recoupPercent += (minimumPrecent - width);
                width = minimumPrecent;
            }

            columns[columnIdentifier].width = width;
        }

        // Enforce the minimum percentage width.
        while (recoupPercent > 0) {
            for (var columnIdentifier in columns) {
                if (columns[columnIdentifier].width > minimumPrecent) {
                    --columns[columnIdentifier].width;
                    --recoupPercent;
                    if (!recoupPercent)
                        break;
                }
            }
        }

        // Change the width property to a string suitable for a style width.
        for (var columnIdentifier in columns)
            columns[columnIdentifier].width += "%";

        var dataGrid = new WebInspector.DataGrid(columns);
        var length = nodes.length;
        for (var i = 0; i < length; ++i)
            dataGrid.appendChild(nodes[i]);

        return dataGrid;
    },

    _startSidebarDragging: function(event)
    {
        WebInspector.elementDragStart(this.sidebarResizeElement, this._sidebarDragging.bind(this), this._endSidebarDragging.bind(this), event, "col-resize");
    },

    _sidebarDragging: function(event)
    {
        this._updateSidebarWidth(event.pageX);

        event.preventDefault();
    },

    _endSidebarDragging: function(event)
    {
        WebInspector.elementDragEnd(event);
    },

    _updateSidebarWidth: function(width)
    {
        if (this.sidebarElement.offsetWidth <= 0) {
            // The stylesheet hasn't loaded yet or the window is closed,
            // so we can't calculate what is need. Return early.
            return;
        }

        if (!("_currentSidebarWidth" in this))
            this._currentSidebarWidth = this.sidebarElement.offsetWidth;

        if (typeof width === "undefined")
            width = this._currentSidebarWidth;

        width = Number.constrain(width, Preferences.minSidebarWidth, window.innerWidth / 2);

        this._currentSidebarWidth = width;

        this.sidebarElement.style.width = width + "px";
        this.databaseViews.style.left = width + "px";
        this.sidebarResizeElement.style.left = (width - 3) + "px";
    }
}

WebInspector.DatabasesPanel.prototype.__proto__ = WebInspector.Panel.prototype;

WebInspector.DatabaseSidebarTreeElement = function(database)
{
    this.database = database;

    WebInspector.SidebarTreeElement.call(this, "database-sidebar-tree-item", "", "", database, true);

    this.refreshTitles();
}

WebInspector.DatabaseSidebarTreeElement.prototype = {
    onselect: function()
    {
        WebInspector.panels.databases.showDatabase(this.database);
    },

    oncollapse: function()
    {
        // Request a refresh after every collapse so the next
        // expand will have an updated table list.
        this.shouldRefreshChildren = true;
    },

    onpopulate: function()
    {
        this.removeChildren();

        var tableNames = this.database.tableNames;
        var tableNamesLength = tableNames.length;
        for (var i = 0; i < tableNamesLength; ++i)
            this.appendChild(new WebInspector.SidebarDatabaseTableTreeElement(this.database, tableNames[i]));
    },

    get mainTitle()
    {
        return this.database.name;
    },

    set mainTitle(x)
    {
        // Do nothing.
    },

    get subtitle()
    {
        return this.database.displayDomain;
    },

    set subtitle(x)
    {
        // Do nothing.
    }
}

WebInspector.DatabaseSidebarTreeElement.prototype.__proto__ = WebInspector.SidebarTreeElement.prototype;

WebInspector.SidebarDatabaseTableTreeElement = function(database, tableName)
{
    this.database = database;
    this.tableName = tableName;

    WebInspector.SidebarTreeElement.call(this, "database-table-sidebar-tree-item small", tableName, "", null, false);
}

WebInspector.SidebarDatabaseTableTreeElement.prototype = {
    onselect: function()
    {
        WebInspector.panels.databases.showDatabase(this.database, this.tableName);
    }
}

WebInspector.SidebarDatabaseTableTreeElement.prototype.__proto__ = WebInspector.SidebarTreeElement.prototype;
