# treeGraphWidgets
The TreeGraphWidgets module contains three pluggable Mendix widgets for displaying data organized as a tree or chart. This includes: OrgCharg (organograms), TreeList (tree data) and PertChart (Pert diagrams).

# Features
## General
The widgets take care of visualizing data for trees and graphs. This will give the developer full freedom to implement the business logic using the toolbox Mendix provides to build UI elements and logic.

## OrgChart
Displays an organizational chart. Positions the nodes relative to their parent nodes. In case multiple root nodes are available in the dataset, the organizational chart of the first node in the data will be presented.

The widget supports panning, scrolling and zooming using the mouse.

## TreeList
Displays hierarchical data in a tree list. Supports indentation of child nodes relative to their parent nodes.

## PertChart
Displays a graph. Positions the nodes relative to their parent nodes.

The widget supports panning, scrolling and zooming using the mouse.

# Usage

## General
Tip: make use of the sample implementation included in the project

## OrgChart
* Create a domain model with an entity for the node
* Add a self-association for the node entity to associate the node to its parent node
* Add a unique identifier as a String attribute
* Add a Boolean attribute to indicate if the node has focus
* Add a Boolean attribute to indicate if the node's children should be displayed
* Add the OrgChart Widget to a page
* Configure the wizard
    * Set the height of the widget
    * Add a datasource for the nodes
    * Select the unique identifier as the Descriptor
    * Select the unique identifier of the parent node as the Parent association
    * Set the Boolean attribute to indicate if the node has focus
    * Set the Boolean attribute to indicate if the node's children should be displayed
    * Set the spacial attributes to define the size and spacing in the chart
    * Set the line type
    * Set a line style

## TreeList
* Create a domain model with an entity for the node
* Add a self-association for the node entity to associate the node to its parent node
* Add a unique identifier as a String attribute
* Add a Boolean attribute to indicate if the node has focus
* Add a Boolean attribute to indicate if the node's children should be displayed
* Add the TreeList Widget to a page
* Configure the wizard
    * Set the height of the widget
    * Add a datasource for the nodes
    * Select the unique identifier as the Descriptor
    * Select the unique identifier of the parent node as the Parent association
    * Set the Boolean attribute to indicate if the node has focus
    * Set the Boolean attribute to indicate if the node's children should be displayed
    * Set the indentation to use for child nodes

## PertChart
* Create a domain model with an entity for the node and an entity for the edges
* Add two 1-* associations between node and edge (one to indicate the parent and one to indicate the child) 
* Add a unique identifier as a String attribute
* Add a Boolean attribute to indicate if the node has focus
* Add a Boolean attribute to indicate if the node has children
* Add an Integer attribute to designate a column for the node (from left to right)
* Add the PertChart Widget to a page
* Configure the wizard
    * Set the height of the widget
    * Add a datasource for the nodes
    * Select the unique identifier as the Descriptor
    * Set the Boolean attribute to indicate if the node has focus
    * Set the Boolean attribute to indicate if the node's children should be displayed
    * Set the indentation to use for child nodes


    * Choose a wizard type (Fixed or Sliding)
    * Add wizard steps by clicking [New]
    * Select an attribute for the active step (this attribute can be used in your logic e.g., to style navigation elements based on whether or not they represent the active step)
    * Select an attribute for the step that was clicked on (this attribute can be used in your logic and is set by the widget when used in sliding mode when the user clicks on a header)
    * Configure widths of widget elements
    * (for sliding wizard only) Configure the action that needs to be carried out when clicking on the header of a wizard step
    * (for static wizard only) Configure the positioning of the navigation (top, right, bottom, left)

## Demo project
https://slidingwizard-sandbox.mxapps.io/

## Issues, suggestions and feature requests
https://github.com/mwbouwkamp-mendix/wizardWidget/

## Development and contribution
Contact autor

## Author
marco.bouwkamp@mendixlabs.com

## Known issues
The widget works less smoothly in a popup
