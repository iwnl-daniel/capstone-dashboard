import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

import "../index.css";
/**
 * ProjectTable - Display all projects located in the database.
 * - Projects that were created by a current logged-in user give the user the choice to delete the project.
 * - Users have the option to subscribe / unsubscribe to a project by selecting the toggle on or off.
 * @component
 * @param {Object[]} projects - An array of projects to be displayed.
 * @returns {JSX.Element} The rendered ProjectTable component.
 */
const ProjectTable = ({ projects }) => {
  return (
    <div className="projectTable">
      <List
        dense
        sx={{ width: "90%", marginLeft: "auto", marginRight: "auto" }}
      >
        {projects.map((item, index) => {
          const labelId = `project-list-${index}`;
          return (
            <ListItem
              sx={{ margin: "5px", bgcolor: "#e8eaed", borderRadius: "5px" }}
              key={index}
              secondaryAction={
                <ListItemText
                  secondaryTypographyProps={{ fontSize: "20px" }}
                  id={labelId}
                  primary={item.projectCreator}
                />
              }
              disablePadding
            >
              <ListItemButton href={`/${item.projectName}`}>
                <ListItemText
                  primaryTypographyProps={{ fontSize: "20px" }}
                  id={labelId}
                  primary={item.projectName}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default ProjectTable;
