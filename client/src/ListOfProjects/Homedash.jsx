import { useMsal } from "@azure/msal-react";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
/**
 * Renders the Dashboard component for a user's assigned projects
 * @component
 * @returns {React.Element} The rendered Dashboard component.
 */
function UserDashboard() {
  /**
   * Represents the list of projects assigned to the user.
   * @type {Array}
   */
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  /**
   * Represents the Microsoft Authentication Library (MSAL) instance.
   * @type {object}
   */
  const { instance } = useMsal();
  /**
   * Represents the active user's email.
   * @type {string}
   */
  const user = instance.getActiveAccount()?.username;
  /**
   * Fetches projects data from the server when the user email changes.
   * @param {string} user - The user's email address.
   * @returns {void}
   */
  useEffect(() => {
    /**
     * Fetches the projects assigned to the user from the server.
     * @async
     */
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3001/user?userEmail=${user}`
        );
        const data = await response.json();
        setProjects(data[0].projectList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, [user]);

  /**
   * Renders the Dashboard component.
   * @returns {JSX.Element} The rendered Dashboard component.
   */
  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        width={"100%"}
        mb={"40px"}
      >
        <Button
          variant="contained"
          color="buttonBlue"
          sx={{
            ml: "5%",
            width: "136px",
            height: "50px",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#cdecfa",
              color: "#016591",
            },
          }}
          onClick={() => navigate("/allProjects")}
        >
          Company Projects
        </Button>
        <Button
          variant="contained"
          color="buttonBlue"
          sx={{
            mr: "5%",
            width: "136px",
            height: "50px",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#cdecfa",
              color: "#016591",
            },
          }}
          onClick={() => navigate("/createProject")}
        >
          + New
        </Button>
      </Box>

      <Box
        sx={{ width: 1 }}
        justifyContent="center"
        alignItems="flex-start"
        gap={2}
      >
        <Box sx={{ width: 1 }}>
          <Typography variant="h5" sx={{ float: "left", marginLeft: "6%" }}>
            {" "}
            Project Name:{" "}
          </Typography>
          <List
            dense
            sx={{ width: "90%", marginLeft: "auto", marginRight: "auto" }}
          >
            {projects.map((item, index) => {
              const labelId = `project-list-${index}`;
              return (
                <ListItem
                  sx={{
                    margin: "5px",
                    bgcolor: "#e8eaed",
                    borderRadius: "5px",
                  }}
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
        </Box>
      </Box>
    </>
  );
}

export default UserDashboard;
