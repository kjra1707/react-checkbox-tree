import React, { Component } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { fileSystem as nodes } from './common.js';

class FilterExample extends Component {
    state = {
        checked: [
            '/app/Http/Controllers/WelcomeController.js',
            '/app/Http/routes.js',
            '/public/assets/style.css',
            '/public/index.html',
            '/.gitignore',
        ],
        expanded: [
            '/app',
        ],
        filterText: '',
        filteredNodes: nodes,
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.filterTree = this.filterTree.bind(this);
        this.filterNodes = this.filterNodes.bind(this);
    }

    onCheck(checked) {
        this.setState({ checked });
    }

    onExpand(expanded) {
        this.setState({ expanded });
    }

    onFilterChange(e) {
        this.setState({ filterText: e.target.value }, this.filterTree);
    }

    filterTree() {
        const { filterText } = this.state;

        // Reset nodes back to unfiltered state
        if (!filterText) {
            this.setState({ filteredNodes: nodes });

            return;
        }

        this.setState({
            filteredNodes: nodes.reduce(this.filterNodes, []),
        });
    }

    filterNodes(filtered, node) {
        if (this.nodeMatchesSearchString(node)) {
            // Node's label matches the search string
            filtered.push(node);
        } else {
            // Find if any children match the search string or have descendants who do
            const filteredChildren = (node.children || []).reduce(this.filterNodes, []);

            // If so, render these children
            if (filteredChildren.length > 0) {
                filtered.push({ ...node, children: filteredChildren });
            }
        }

        return filtered;
    }

    nodeMatchesSearchString({ label }) {
        const { filterText } = this.state;

        return label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1;
    }

    render() {
        const {
            checked,
            expanded,
            filterText,
            filteredNodes,
        } = this.state;

        return (
            <div className="filter-container">
                <input
                    className="filter-text"
                    placeholder="Search..."
                    type="text"
                    value={filterText}
                    onChange={this.onFilterChange}
                />
                <CheckboxTree
                    checked={checked}
                    expanded={expanded}
                    nodes={filteredNodes}
                    onCheck={this.onCheck}
                    onExpand={this.onExpand}
                />
            </div>
        );
    }
}

export default FilterExample;
