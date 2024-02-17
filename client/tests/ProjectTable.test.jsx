import { render, screen } from "@testing-library/react";
import ProjectTable from "../src/ListOfProjects/ProjectTable";

describe("ProjectTable", () => {
  // tests if the table is the correct size for the amount of items in it
  test("Renders the correct number of project items", () => {
    const projects = [
      { projectName: "Project 1", projectCreator: "User 1" },
      { projectName: "Project 2", projectCreator: "User 2" },
      { projectName: "Project 3", projectCreator: "User 3" },
    ];
    render(<ProjectTable projects={projects} />);

    const projectItems = screen.getAllByRole("listitem");
    expect(projectItems.length).toBe(projects.length);
  });
  // tests if the correct project and project creator is displayed
  test("Displays the correct project name and creator in project items", () => {
    const projects = [
      { projectName: "Project 1", projectCreator: "User 1" },
      { projectName: "Project 2", projectCreator: "User 2" },
    ];
    render(<ProjectTable projects={projects} />);

    const projectItems = screen.getAllByRole("listitem");

    projects.forEach((project, index) => {
      const projectName = screen.getByText(project.projectName);
      const projectCreator = screen.getByText(project.projectCreator);

      expect(projectName).toBeInTheDocument();
      expect(projectCreator).toBeInTheDocument();
      expect(projectItems[index]).toContainElement(projectName);
      expect(projectItems[index]).toContainElement(projectCreator);
    });
  });
});
